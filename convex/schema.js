import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profileImages: defineTable({
    userId: v.string(),
    storageId: v.id("_storage"),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_userId", ["userId"]),
});
