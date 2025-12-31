import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for profile images
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save storage ID to database
export const saveProfileImage = mutation({
  args: { 
    storageId: v.id("_storage"), 
    userId: v.string() 
  },
  handler: async (ctx, args) => {
    // Check if user already has a profile image
    const existing = await ctx.db
      .query("profileImages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        updatedAt: Date.now(),
      });
    } else {
      // Create new record
      await ctx.db.insert("profileImages", {
        userId: args.userId,
        storageId: args.storageId,
        createdAt: Date.now(),
      });
    }

    return args.storageId;
  },
});

// Get profile image URL
export const getProfileImageUrl = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const profileImage = await ctx.db
      .query("profileImages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!profileImage) return null;

    const url = await ctx.storage.getUrl(profileImage.storageId);
    return url;
  },
});
