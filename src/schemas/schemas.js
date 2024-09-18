const { z } = require("zod");

const brandSchema = z.object({
    name: z.string().optional().refine(val => val !== undefined, { message: "Invalid Brand Name" }),
    slug: z.string().optional().refine(val => val !== undefined, { message: "Invalid Brand Slug" })
});

const categorySchema = z.object({
    name: z.string().optional().refine(val => val !== undefined, { message: "Invalid Category Name" }),
    slug: z.string().optional().refine(val => val !== undefined, { message: "Invalid Category Slug" })
});

const subcategorySchema = z.object({
    name: z.string().optional().refine(val => val !== undefined, { message: "Invalid Subcategory Name" }),
    slug: z.string().optional().refine(val => val !== undefined, { message: "Invalid Subcategory Slug" }),
    categoryId: z.number().int().positive({ message: "Invalid Category ID for Subcategory" })
});

const productSchema = z.object({
    name: z.string().optional().refine(val => val !== undefined, { message: "Invalid Product Name" }),
    description: z.string().optional().refine(val => val !== undefined, { message: "Invalid Product Description" }),
    price: z.number().positive({ message: "Invalid Product Price" }),
    discount: z.number().int().positive({ message: "Invalid Product Discount" }),
    images: z.array(z.string()).min(1, { message: "Invalid Product Images" }),  // Changed nonempty to min(1)
    categoryId: z.number().int().positive({ message: "Invalid Category ID for Product" }),
    subcategoryId: z.number().int().optional().refine(val => val !== undefined, { message: "Invalid Subcategory ID for Product" }),
    brandsId: z.number().int().positive({ message: "Invalid Brand ID for Product" }),
    Colors: z.enum(['RED', 'GREEN', 'BLUE', 'BLACK', 'WHITE'], { message: "Invalid Product Color" }),
    Size: z.enum(['S', 'M', 'L', 'XL', 'XXL'], { message: "Invalid Product Size" })
});

const registerSchema = z.object({
    username: z.string().min(1, { message: "Invalid Username" }),  // Changed nonempty to min(1)
    email: z.string().email({ message: "Invalid Email" }),
    user_img: z.array(z.string()).optional(),  
    name: z.string().min(1, { message: "Invalid Name" }),  // Changed nonempty to min(1)
    phone: z.string().min(1, { message: "Invalid Phone Number" }),  // Changed nonempty to min(1)
    address: z.string().optional(),
    dob: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'GAY', 'TRANS'], { message: "Invalid Gender" }),
    password: z.string().min(1, { message: "Invalid Password" })  // Changed nonempty to min(1)
});

const loginSchema = z.object({
    username: z.string().min(1, { message: "Invalid Username" }),  // Changed nonempty to min(1)
    password: z.string().min(1, { message: "Invalid Password" })  // Changed nonempty to min(1)
});

module.exports = {
    brandSchema,
    categorySchema,
    subcategorySchema,
    loginSchema,
    productSchema,
    registerSchema
};
