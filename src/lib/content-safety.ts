export type DetectionResult = {
  detected: boolean;
  policyId?: string; // 'PHONE', 'EMAIL', 'LINK', 'PLATFORM_HANDLE'
  matchedContent?: string[];
  message?: string;
};

export type DetectionOptions = {
  strict?: boolean; // If true, blocks vague matches (like 10-digit numbers without separators)
};

class ContentSafetyDetector {
  private patterns = {
    // Phone: Matches various international formats, including +91, 0-9 separators, etc.
    phoneStrict:
      /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/,
    
    // Loose check for spaced out numbers, looking for 7-15 digits
    // normalized text will be used for this
    phoneDigitsOnly: /\b\d{7,15}\b/,

    // Email: Standard and Obfuscated ([at], [dot], spaces)
    email: /\b[A-Za-z0-9._%+-]+@\s*[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    emailObfuscated: /\b[A-Za-z0-9._%+-]+\s*(?:\[at\]|\(at\)|@| at )\s*[A-Za-z0-9.-]+\s*(?:\[dot\]|\(dot\)|\.| dot )\s*[A-Za-z]{2,}\b/i,

    // Communication Links & Domains
    links:
      /\b(?:https?:\/\/)?(?:www\.)?(?:wa\.me|api\.whatsapp\.com|t\.me|telegram\.me|discord\.gg|discordapp\.com\/invite|zoom\.us|meet\.google\.com|teams\.microsoft\.com|skype:[a-z]+|instagr\.am|instagram\.com\/[a-zA-Z0-9_.]+|snapchat\.com\/add\/[a-zA-Z0-9_.]+)\b/i,
    
    // Usernames / Keywords
    // Aggressive check for keywords even without strict context if strict mode is on
    platformKeywords:
      /\b(?:discord|skype|telegram|whatsapp|insta|snapchat)\b/i,
    
    // Specific handles like "discord: user"
    platformHandles:
      /\b(?:(?:discord|skype|telegram|whatsapp|insta|snapchat)\s*(?:id|user|name|:|-)\s*[:=]?\s*@?([a-zA-Z0-9_.]+))\b/i,
  };

  detect(text: string, options: DetectionOptions = { strict: true }): DetectionResult {
    if (!text) return { detected: false };

    // Normalize text for evasion detection
    // 1. Remove spaces between look-alike characters to catch "t e s t @ e x a m p l e . c o m"
    //    We will check the original text first, then normalized versions.
    const textNoSpaces = text.replace(/\s+/g, '');
    
    // 2. Check prohibited links
    const linkMatch = text.match(this.patterns.links) || textNoSpaces.match(this.patterns.links);
    if (linkMatch) {
      return {
        detected: true,
        policyId: 'LINK',
        matchedContent: [linkMatch[0]],
        message: 'Sharing external communication links is not allowed.',
      };
    }

    // 3. Check Emails
    // Standard check
    const emailMatch = text.match(this.patterns.email);
    if (emailMatch) {
      return {
        detected: true,
        policyId: 'EMAIL',
        matchedContent: [emailMatch[0]],
        message: 'Sharing email addresses is not allowed.',
      };
    }

    // Obfuscated check (test[at]example)
    const emailObfuscatedMatch = text.match(this.patterns.emailObfuscated);
    if (emailObfuscatedMatch) {
        return {
          detected: true,
          policyId: 'EMAIL',
          matchedContent: [emailObfuscatedMatch[0]],
          message: 'Sharing email addresses is not allowed.',
        };
    }
    
    // Spaced out email check (check normalized version)
    // We need to be careful not to flag "this is great.come over" as email -> "thisisgreat.comeover"
    // So we rely on the @ symbol presence in normalized text usually
    if (textNoSpaces.includes('@')) {
        const emailNoSpaceMatch = textNoSpaces.match(this.patterns.email);
        if (emailNoSpaceMatch) {
             return {
                detected: true,
                policyId: 'EMAIL',
                matchedContent: [text], // show original text as match context
                message: 'Sharing email addresses is not allowed.',
            };
        }
    }

    // 4. Check Phone Numbers
    // Strict regex on original text
    const phoneStrictMatch = text.match(this.patterns.phoneStrict);
    if (phoneStrictMatch) {
      const digits = phoneStrictMatch[0].replace(/\D/g, '');
      if (digits.length >= 7 && digits.length <= 15) {
         return {
          detected: true,
          policyId: 'PHONE',
          matchedContent: [phoneStrictMatch[0]],
          message: 'Sharing phone numbers is not allowed.',
        };
      }
    }
    
    // Spaced out numbers: "1 2 3 4 5"
    // We normalize by removing all non-digits
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        // To avoid false positives (like a long ID number), we might want to check if the original text had spaces 
        // OR if strict mode is enabled.
        // If a user types "1000000000" (billion), it catches it.
        // Assuming strict safety:
        return {
            detected: true,
            policyId: 'PHONE',
            matchedContent: [digitsOnly], // showing digits
            message: 'Sharing phone numbers/long digit sequences is not allowed.',
        };
    }

    // 5. Platform Keywords
    // "discord", "whatsapp" etc.
    // Ensure strict mode is considered if we want to be less aggressive, 
    // but the user complained about "discord" passing, so strictly blocking it by default is good.
    // We use options.strict to toggle the "digitsOnly" check or others.
    
    if (options.strict) {
       // Aggressive keyword check
       const keywordMatch = text.match(this.patterns.platformKeywords);
       if (keywordMatch) {
           return {
               detected: true,
               policyId: 'PLATFORM_KEYWORD', 
               matchedContent: [keywordMatch[0]],
               message: 'Sharing platform names/invites is not allowed.',
           }
       }
    } else {
        // Less aggressive check, maybe only handles
        const handleMatch = text.match(this.patterns.platformHandles);
        if (handleMatch) {
            return {
                detected: true,
                policyId: 'PLATFORM_KEYWORD',
                matchedContent: [handleMatch[0]],
                message: 'Sharing platform handles is not allowed',
            }
        }
    }

    return { detected: false };
  }
}

export const contentSafety = new ContentSafetyDetector();
