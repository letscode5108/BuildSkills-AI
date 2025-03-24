// controllers/userController.js
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export const getProfile = async (req, res) => {
  try {
    const email = req.user.email;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        preferences: true,
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
            progress: true
          }
        },
        stepProgress: {
          include: {
            step: {
              include: {
                learningPath: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove sensitive data
    const { password, hashedToken, ...safeUser } = user;
    
    res.json(safeUser);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.email;
    const { name, email, image, skillLevel } = req.body;
    
    // Validate input
    if (email && !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    const updatedUser = await prisma.user.update({
      where: { email: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(image && { image }),
        ...(skillLevel && { skillLevel })
      }
    });
    
    // Remove sensitive data
    const { password, hashedToken, ...safeUser } = updatedUser;
    
    res.json(safeUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Email already in use" });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getPreferences = async (req, res) => {
  try {
    // First get the user with their actual ID
    const user = await prisma.user.findUnique({
      where: { email: req.user.email }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id }  // Use the actual ID
    });
    
    // Create default preferences if none exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          userId: user.id,  // Use the actual ID
          timeZone: "UTC",
          dailyWorkHours: 8,
          emailNotifications: true,
          theme: "light"
        }
      });
    }
    
    res.json(preferences);
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ error: "Failed to retrieve preferences" });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    // Get user by email first
    const user = await prisma.user.findUnique({
      where: { email: req.user.email }
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { timeZone, dailyWorkHours, emailNotifications, theme } = req.body;
    
    if (dailyWorkHours && (dailyWorkHours < 1 || dailyWorkHours > 24)) {
      return res.status(400).json({ error: "Daily work hours must be between 1 and 24" });
    }
  
  
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        ...(timeZone && { timeZone }),
        ...(dailyWorkHours && { dailyWorkHours }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(theme && { theme })
      },
      create: {
        userId: user.id,
        timeZone: timeZone || "UTC",
        dailyWorkHours: dailyWorkHours || 8,
        emailNotifications: emailNotifications ?? true,
        theme: theme || "light"
      }
    });
    
    res.json(preferences);
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
};








