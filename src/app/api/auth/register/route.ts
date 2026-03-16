import { NextResponse, NextRequest } from "next/server";
import { registerSchema } from "@/src/lib/validation/authSchema";
import bcrypt from "bcryptjs";
import { generateOTP } from "@/src/lib/tokens";
import { UserRole } from "@/generated/prisma/client";
import prisma from "@/src/lib/prisma";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import { sendVerificationEmail } from "@/src/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    let role = formData.get("role") as string;

    // Tutor fields
    const bio = formData.get("bio") as string | null;
    const experienceType = formData.get("experienceType") as string | null;
    const experienceYears = formData.get("experienceYears") as string | null;
    const subjectsRaw = formData.get("subjects") as string | null;
    const subjectsOthers = formData.get("subjectsOthers") as string | null;
    const classesTaughtRaw = formData.get("classesTaught") as string | null;
    const adhaarId = formData.get("adhaarId") as string | null;
    const location = formData.get("location") as string | null;
    const phoneNumber = formData.get("phoneNumber") as string;

    let subjects: string[] = [];
    if (subjectsRaw) {
      try {
        subjects = JSON.parse(subjectsRaw);
      } catch {
        subjects = subjectsRaw.split(',').map(s => s.trim());
      }
    }
    if (subjectsOthers) {
      subjects.push(subjectsOthers);
    }

    let classesTaught: string[] = [];
    if (classesTaughtRaw) {
      try {
        classesTaught = JSON.parse(classesTaughtRaw);
      } catch {
        classesTaught = classesTaughtRaw.split(',').map(s => s.trim());
      }
    }

    // Normalize role
    if (role === "TEACHER") role = "TUTOR";

    const verificationDocument = formData.get("verificationDocument") as File | null;
    const profilePhoto = formData.get("profilePhoto") as File | null;

    // Validate fields
    const parse = registerSchema.safeParse({ 
        fullname, email, password, role, phoneNumber,
        bio: bio || undefined,
        experienceType: experienceType || undefined,
        experienceYears: experienceYears ? parseInt(experienceYears) : undefined,
        subjects: subjects.length > 0 ? subjects : undefined,
        subjectsOthers: subjectsOthers || undefined,
        classesTaught: classesTaught.length > 0 ? classesTaught : undefined,
        adhaarId: adhaarId || undefined,
        location: location || undefined
    });

    if (!parse.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parse.error.flatten() },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Handle File Uploads via Cloudinary
    let verificationDocumentUrl = null;
    let profilePhotoUrl = null;

    try {
        if (verificationDocument && (verificationDocument as File).size > 0) {
            verificationDocumentUrl = await uploadToCloudinary(verificationDocument, "documents");
        }
        if (profilePhoto && (profilePhoto as File).size > 0) {
            profilePhotoUrl = await uploadToCloudinary(profilePhoto, "avatars");
        }
    } catch (uploadError) {
        console.error("Upload failed", uploadError);
        return NextResponse.json({ message: "File upload failed" }, { status: 500 });
    }

    // derive a username
    const baseUsername = (email?.split("@")[0] || fullname.replace(/\s+/g, "").toLowerCase()).slice(0, 24);
    let username = baseUsername;
    let suffix = 0;
    while (await prisma.user.findUnique({ where: { username } })) {
      suffix += 1;
      username = `${baseUsername}${suffix}`.slice(0, 30);
      if (suffix > 50) break;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateOTP();
    const verificationTokenExpiry = new Date(Date.now() + 3600 * 1000);

    // Compose experience string for DB
    const experienceStr = experienceType === 'others' 
      ? `${experienceYears} years` 
      : experienceType;

    // Create User and Profile using transaction or nested write
    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
        fullname,
        phoneNumber,
        role: role as UserRole,
        verficationToken: verificationToken,
        verficationTokenExpiry: verificationTokenExpiry,
        isVerified: false,
        verificationDocument: verificationDocumentUrl,
        image: profilePhotoUrl,
        profileImage: profilePhotoUrl,
        
        // Conditional Tutor Profile creation
        ...(role === "TUTOR" ? {
            tutorProfile: {
                create: {
                   bio: bio,
                   experience: experienceStr,
                   classesTaught: classesTaught.join(', '),
                   adhaarId: adhaarId,
                   location: location,
                   subjects: subjects,
                }
            }
        } : {})
      },
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // We don't return error here because user is already created
      // They can request a resend later
    }

    return NextResponse.json({ message: "User created. Please verify your email.", userId: user.id }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Registration error:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
