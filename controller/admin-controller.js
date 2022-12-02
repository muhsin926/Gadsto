const { dologin } = require("./user-controller");
const userModel = require("../model/signupModel");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const bannerModel = require("../model/bannerModel");
const orderModel = require("../model/orderSchema");
const coupenModel = require("../model/coupenModel");
const bcrypt = require("bcrypt");
const session = require("express-session");
const moment = require("moment");

module.exports = {
  // Admin Login Page
  login: async(req, res) => {
    if (req.session.adminLogin) {
      const totalOrder = await orderModel.find({}).countDocuments()
      const totalProduct = await productModel.find({}).countDocuments()
      const totalCategory = await categoryModel.find({}).countDocuments()
      const totalUser = await userModel.find({}).countDocuments()
      const recentOrders = await orderModel.find({}).sort({date:-1}).limit(10)
      const newUser = await userModel.find({}).sort({date:-1}).limit(4)
      res.render("admin/index",{totalCategory,totalOrder,totalProduct,totalUser,recentOrders,moment,newUser});
    } else {
      res.render("admin/login");
    }
  },

  // Admin Submit Login
  adminDologin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await userModel.findOne({
        $and: [{ email: email }, { type: "admin" }],
      });
      if (admin) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          req.session.adminLogin = true;
          res.redirect("/admin");
        } else {
          res.redirect("/admin");
        }
      } else {
        res.redirect("/admin");
      }
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // User Manage
  userManage: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 5;
      const countAllUser = await userModel
        .find({ type: { $ne: "admin" } })
        .countDocuments();
      const pageNum = Math.ceil(countAllUser / 5);
      allUsers = await userModel
        .find({ type: { $ne: "admin" } })
        .skip((page - 1) * perPage)
        .limit(perPage);
      res.render("admin/user-management", {
        allUsers,
        page,
        pageNum,
      });
    } catch (err) {
      console.log(err);
      res.json("Something wrong, please try again");
    }
  },

  //block User
  blockUser: async (req, res) => {
    try {
      const id = req.query.id;
      await userModel
        .findByIdAndUpdate({ _id: id }, { $set: { type: "Blocked" } })
        .then(() => {
          res.redirect("/admin/user-manage");
        });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Unblock User
  unBlockUser: async (req, res) => {
    try {
      const id = req.query.id;
      await userModel
        .findByIdAndUpdate({ _id: id }, { $set: { type: "User" } })
        .then(() => {
          res.redirect("/admin/user-manage");
        });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Products Management
  productManage: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 5;
      const countAllProduct = await productModel
        .find({ delete: { $ne: true } })
        .countDocuments();
      const pageNum = Math.ceil(countAllProduct / 5);
      const allProducts = await productModel
        .find({ delete: { $ne: true } })
        .skip((page - 1) * perPage)
        .limit(perPage);
      res.render("admin/product-manage", { allProducts, pageNum, page });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Render Add Product Page
  createProduct: async (req, res) => {
    try {
      const categories = await categoryModel.find({ delete: { $ne: true } });
      res.render("admin/addproduct", { categories });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Add Product
  addProdcut: async (req, res) => {
    try {
      const { category, name, description, price, stock } = req.body;
      const image = req.file;
      const newProduct = productModel({
        category,
        name,
        description,
        price,
        stock,
        image: image.filename,
      });
      await newProduct.save();
      res.redirect("/admin/product-manage");
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Delete product
  deleteProduct: async (req, res) => {
    try {
      const id = req.query.proId;
      await productModel
        .findByIdAndUpdate({ _id: id }, { $set: { delete: true } })
        .then(() => {
          res.redirect("/admin/product-manage");
        });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Edit Product
  editProduct: async (req, res) => {
    try {
      const id = req.query.proId;
      const categories = await categoryModel.find({ delete: { $ne: true } });
      const product = await productModel.findOne({ _id: id });
      if (product) {
        res.render("admin/editproduct", { product, categories });
      }
    } catch {
      res.redirect("/admin-login");
    }
  },

  //update product
  updateProduct: async (req, res) => {
    try {
      const id = req.query.id;
      const image = req.file;
      const { category, name, description, price, stock } = req.body;
      if (image) {
        const productImage = await productModel.findByIdAndUpdate(
          { _id: id },
          { $set: { image: image.filename } }
        );
      }
      const product = await productModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            category,
            name,
            description,
            price,
            stock,
          },
        }
      );
      await product.save().then(() => {
        res.redirect("/admin/product-manage");
      });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //category Management
  categoryMange: async (req, res) => {
    try {
      const categories = await categoryModel.find({ delete: { $ne: true } });
      res.render("admin/category", { categories, exist: req.session.category });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //new Category
  addCategory: async (req, res) => {
    try {
      let addCategory = req.body.category;
      let category = addCategory[0].toUpperCase();
      addCategory = addCategory.slice(1);
      category = category + addCategory.toLowerCase();
      const exist = await categoryModel.findOne({
        category: category,
        delete: { $ne: true },
      });

      if (exist) {
        req.session.category = true;
        res.redirect("/admin/category-manage");
      } else {
        const newCategory = await categoryModel({ category });
        await newCategory.save().then(() => {
          req.session.category = false;
          res.redirect("/admin/category-manage");
        });
      }
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //delete category
  deleteCategory: async (req, res) => {
    try {
      console.log('vannu');
      const id = req.query.catId;
      const deleteCategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        { $set: { delete: true } }
      );
      await deleteCategory.save().then(() => {
        res.json('success')
      });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Banner Management
  bannerManage: async (req, res) => {
    try {
      const allBanner = await bannerModel.find({ delete: { $ne: true } });
      const categories = await categoryModel.find({ delete: { $ne: true } });
      res.render("admin/banner-manage", { allBanner, categories });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Create a new banner
  newBanner: async (req, res) => {
    try {
      const { category, title, text } = req.body;
      const image = req.file;
      const newBanner = await bannerModel({
        category,
        title,
        text,
        imageUrl: image.filename,
      });
      await newBanner.save().then(() => {
        res.redirect("/admin/banner-manage");
      });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Delete Banner
  deleteBanner: async (req, res) => {
    try {
      const id = req.query.id;
      const deleteBanner = await bannerModel.findOneAndUpdate(
        { _id: id },
        { $set: { delete: true } }
      );
      deleteBanner.save().then(() => {
        res.json('success')
      });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Edit Banner
  editBanner: async (req, res) => {
    try {
      const id = req.params.id;
      const banner = await bannerModel.findOne({ _id: id });
      const categories = await categoryModel.find({ delete: { $ne: true } });
      res.render("admin/editBanner", { banner, categories });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Update Banner
  updateBanner: async (req, res) => {
    try {
      const id = req.params.id;
      const { category, title, text } = req.body;
      const image = req.file;
      const banner = await bannerModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            category,
            title,
            text,
            imageUrl: image.filename,
          },
        }
      );
      banner.save().then(() => {
        res.redirect("/admin/banner-manage");
      });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  //Order Management
  orderManage: async (req, res) => {
    try {
      const getAllOrders = await orderModel
        .find({})
        .populate("userId")
        .populate("products.product");
      res.render("admin/order-manage", { getAllOrders, moment });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Coupen Management
  coupenManage: async (req, res) => {
    try {
      const coupens = await coupenModel.find({});
      res.render("admin/coupen-manage", { coupens });
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // Add Coupen
  addCoupen: async (req, res) => {
    try {
      const coupen = req.body;
      console.log(coupen);
      await new coupenModel(coupen).save();
      res.redirect("/admin/coupen-manage");
    } catch {
      res.json("Something wrong, please try again");
    }
  },

  // change status
  changeStatus: async (req, res) => {
    console.log("ehing");
    const { status, orderId, proId } = req.body;
    console.log(req.body);
    if (status == "Order Confirmed") {
      await orderModel.findOneAndUpdate(
        { _id: orderId, "products.product": proId },
        {
          $set: { "products.$.status": "Packed" },
        }
      );
    } else if (status == "Packed") {
      await orderModel.findOneAndUpdate(
        { _id: orderId, "products.product": proId },
        {
          $set: { "products.$.status": "Shipping" },
        }
      );
    } else if (status == "Shipping") {
      await orderModel.findOneAndUpdate(
        { _id: orderId, "products.product": proId },
        {
          $set: { "products.$.status": "Delivered" },
        }
      );
    } else {
      await orderModel.findOneAndUpdate(
        { _id: orderId, "products.product": proId },
        {
          $set: { "products.$.status": "Canceled" },
        }
      );
    }

    res.json({ success: "success" });
  },

  // Print Bill
  printBill: async (req, res) => {
    const orderId = req.params.orderId;
    const order = await orderModel
      .findOne({ _id: orderId })
      .populate("products.product")
      .populate("userId");
    const products = order.products;
    const address = order.address;
    res.render("admin/bill", { order, products, moment });
  },

  salesReport: async(req,res)=>{
    
      let orders = await orderModel.find({})
    
    const filterOrder = await orderModel.find({})
    res.render('admin/sales-report',{orders})
  },

  //Admin Logout
  adminLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
  },
};
