const User = require('../models/userModel');
// const Exam = require('../models/examModel');
// const Quiz = require('../models/quizModel');
// const Forum = require('../models/forumModel');
// const Material = require('../models/materialModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
//const generateToken = require('../config/jwt');
const validateMongoDbId = require('../utils/validateMongoDbId');
const generateToken = require('../config/token');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const createStudent = asyncHandler( async (req, res) => {
          const email = req.body.email;
          const user = await User.findOne({email: email});
          if(!user){
              // create a new user
              const newUser = await User.create(req.body);
              res.json({
                  newUser  
              })
          }
          else{
            throw err = new Error('This User already exists!');
         }
        
    }
);

const createSME = asyncHandler( async (req, res) => {
          const email = req.body.email;
          const user = await User.findOne({email: email});
          if(!user){
              // create a new user
              const newUser = await User.create(req.body);
              res.json({
                  newUser  
              })
          }
          else{
            throw err = new Error('This User already exists!');
         }
        
    }
);
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (user) {
    await User.deleteOne({_id: userId});
    res.json({"Deleted user" : user});
  } else {
    res.status(404).json({ error: "No user found with this ID" });
  }
});
const blockUser = asyncHandler (async(req, res) => {
    const {userId} = req.params;
    const user = await User.findById(userId);
    if(user){
      await User.findByIdAndUpdate(user._id, 
        {
          isBlocked: true,
        },
        {
           new: true,
        },
      );
      res.json({Message: "User Blocked!"})
    } else {
      res.status(404).json({ error: "No user found with this ID" });
    }
        
});

const unblockUser = asyncHandler (async(req, res) => {
    const {userId} = req.params;
    //validateMongoDbId(id);
    const user = await User.findById(userId);
    if(user) {
     await User.findByIdAndUpdate(user._id, 
          {
            isBlocked: false, 
          },
          {
            new: true,
          },
        );
        res.json("User unblocked!");
      }
    else {
        res.status(404).json({ error: "No user found with this ID" });
    }
});
const loginUser = asyncHandler (async(req,res) => {
  const {email, password} = req.body;
  //Check if user exists
  const user = await User.findOne({email});
  if(user){
    if(!(await user.isPasswordMatched(password))){
      console.log(await user.isPasswordMatched(password));
      res.status(401).json("Wrong password!");
    }
    else {
      const token = generateToken(user._id);
      user.token = token;

      res.cookie("token",token,{
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(200).json(user);
    }   
}
else {
  res.status(401).json("No user found with this email!");
}
});
const loginAdmin = asyncHandler (async(req,res) => {
  const {email, password} = req.body;
  //Check if user exists
  const user = await User.findOne({email});
  if(user){
    if((user && user.role !== 'admin')){
      res.status(403).json("Not authorized!");
    }
    else if(!(await user.isPasswordMatched(password))){
      console.log(await user.isPasswordMatched(password));
      res.status(401).json("Wrong password!");
    }
    else {
      const token = generateToken(user._id);
      user.token = token;

      res.cookie("token",token,{
          httpOnly: true,
          maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(200).json(user);
    }   
}
else {
  res.status(401).json("No user found with this email!");
}
});

// //Handle Refreshed token
// const handleRefreshedToken = asyncHandler(async (req, res) => {
//     const cookie = req.cookies;
//     if (!cookie?.newToken) throw new Error("No Refresh Token in Cookies");
//     const newToken = cookie.newToken;
//     const user = await User.findOne({ newToken });
//     if (!user) throw new Error(" No Refresh token present in db or not matched");
//     jwt.verify(newToken, process.env.JWT_SECRET, (err, decoded) => {
//       if (err || user.id !== decoded.id) {
//         throw new Error("There is something wrong with refresh token");
//       }
//       const accessToken = generateToken(user?._id);
//       res.json({ accessToken });
//     });
//   });
// //Logout User
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.token) throw new Error("No Refresh Token in Cookies");

  const token = cookie.token;
  
  const user = await User.findOne({ token });
  if (!user) {
    // If the user is not found, clear the cookies and return the appropriate response
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // No Content
  }

  // Invalidate the user's token by setting it to null in the database
  user.token = null;
  await user.save();

  // Clear the cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  res.sendStatus(204); // No Content
});
const logoutAdmin = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.token) throw new Error("No Refresh Token in Cookies");

  const token = cookie.token;
  
  const user = await User.findOne({ token });
  if (!user) {
    // If the user is not found, clear the cookies and return the appropriate response
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // No Content
  }

  // Check if the user is an admin
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Un authorized!' });
  }

  // Invalidate the user's token by setting it to null in the database
  user.token = null;
  await user.save();

  // Clear the cookies
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });

  res.sendStatus(204); // No Content
});
// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, email, password, phone } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phone: phone,
    },
    {
      new: true,
    }
  );

  res.json(updatedUser);
});

// Get all users
const getallUsers = asyncHandler( async(req, res) =>{
    
        const AllUsers = await User.find();
        if(AllUsers){
        res.json(AllUsers);
        }
        else{
          res.status(500).json("Internal server error!");
        }
});
const getUserById = asyncHandler( async (req, res) =>{
    const {userId} = req.params;
    validateMongoDbId(id);
        const user = await User.findById(userId);
        if(user){
          res.json({user});
        }
        else{
          res.status(401).json("No user found with this id!");
        }
        
});
// const updatePassword = asyncHandler( async(req, res) => {
//     const {_id}  = req.user;
//     const {password} = req.body;
//     validateMongoDbId(_id);
//     const user = await User.findById(_id);
//     if (password) {
//         user.password = password; 
//         const updatedPassword = user.save();
//         res.json(updatedPassword);
//     }
//     else{
//         res.json(user);
//     }
// });
const forgotPassword = asyncHandler( async(req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user) throw new Error("User not found with this email!");
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here </a>`;
      const data = {
          to: email,
          text: "Hey User",
          subject: "forgot Password Link",
          htm: resetURL
      };
      sendEmail(data);
      console.log(token);
      res.json(token);
});
const resetPassword = asyncHandler( async(req, res) => {
    const {newPassword} = req.body;
    const {token} = req.params;
    const resetToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpires: {$gt: Date.now()}
    });
    if(!user) throw new Error('Token Expired, Please try again later!');
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)

});

// const userCart = asyncHandler(async (req, res) => {
//     const { productId, color, quantity, price } = req.body;
//     const { _id } = req.user;
//     validateMongoDbId(_id);
//     try {
      
//       let newCart = await new Cart({
//         userId: _id,
//         productId,  
//         color,
//         quantity,
//         price, 
//       }).save();
//       res.json(newCart);
//     } catch (error) {
//       throw new Error(error);
//     }
//   });
// const UpdateCartIemQuantity = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { cartItemId,newQuantity } = req.params;
//   validateMongoDbId(_id);
//   try {
//     const cartItem = await Cart.findOne({ userId: _id, _id: cartItemId });
//     cartItem.quantity = newQuantity;
//     cartItem.save()
//     res.json(cartItem);
//   } catch (error) {
//     throw new Error(error);
//   }
// }); 
// const removeProductFromCart = asyncHandler( async(req, res) => {
//   const { _id } = req.user;
//   const { cartItemId } = req.params;
//   validateMongoDbId(_id);
//   try {
//     const deleteCart = await Cart.deleteOne({ userId: _id, _id: cartItemId })
  
//     res.json(deleteCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getUserCart = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     const cart = await Cart.find({ userId: _id }).populate(
//       "productId"
//     ).populate("color");
//     res.json(cart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const emptyCart = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     const user = await User.findOne({ _id });
//     const cart = await Cart.findOneAndRemove({ orderby: user._id });
//     res.json(cart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const applyCoupon = asyncHandler(async (req, res) => {
//   const { coupon } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   const validCoupon = await Coupon.findOne({ name: coupon });
//   if (validCoupon === null) {
//     throw new Error("Invalid Coupon");
//   }
//   const user = await User.findOne({ _id });
//   let { cartTotal } = await Cart.findOne({
//     orderby: user._id,
//   }).populate("products.product");
//   let totalAfterDiscount = (
//     cartTotal -
//     (cartTotal * validCoupon.discount) / 100
//   ).toFixed(2);
//   await Cart.findOneAndUpdate(
//     { orderby: user._id },
//     { totalAfterDiscount },
//     { new: true }
//   );
//   res.json(totalAfterDiscount);
// });
// const getWishlist = asyncHandler( async(req, res) => {
//     const {_id} = req.user;
//     try{
//         const findUser = await User.findById(_id).populate('wishlist');
//         res.json(findUser);
//     }catch(err){
//         throw new Error(err);
//     }
// });
// const createOrder = asyncHandler(async (req, res) => {
//   const {shippingInfo, orderItems } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     const order = await Order.create({
//       user: _id,
//       shippingInfo: shippingInfo,
//       orderItems: orderItems,
//      });
//       res.json({
//         order, 
//         success: true,
//   });

//     // if (!COD) throw new Error("Create cash order failed");
//     // const user = await User.findById(_id);
//     // let userCart = await Cart.findOne({ orderby: user._id });
//     // let finalAmout = 0;
//     // if (couponApplied && userCart.totalAfterDiscount) {
//     //   finalAmout = userCart.totalAfterDiscount;
//     // } else {
//     //   finalAmout = userCart.cartTotal;
//     // }

//     // let newOrder = await new Order({
//     //   products: userCart.products,
//     //   paymentIntent: {
//     //     id: uniqid(),
//     //     method: "COD",
//     //     amount: finalAmout,
//     //     status: "Cash on Delivery",
//     //     created: Date.now(),
//     //     currency: "ETB",
//     //   },
//     //   orderby: user._id,
//     //   orderStatus: "Cash on Delivery",
//     // }).save();
//     // let update = userCart.products.map((item) => {
//     //   return {
//     //     updateOne: {
//     //       filter: { _id: item.product._id },
//     //       update: { $inc: { quantity: - item.count, sold: + item.count } },
//     //     },
//     //   };
//     // });
//     // const updated = await Product.bulkWrite(update, {});
//     // res.json({ message: "success" });
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getMyOrders = asyncHandler( async(req, res) => {
//   const { _id } = req.user;
//   try {
//     const orders = await Order.findOne({user: _id}).populate("user").populate("orderItems.product").populate("orderItems.color");
//     res.json(orders);
//   }catch(error) {
//     throw new Error(error);
//   }
  
// });
// const getOrders = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     const userorders = await Order.findOne({ orderby: _id })
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//     res.json(userorders);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// const getAllOrders = asyncHandler(async (req, res) => {
//   try {
//     const alluserorders = await Order.find()
//       .populate("orderItems.product")
//       .populate("user")
//       .exec();
//     res.json(alluserorders);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getOrderByUserId = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const userorders = await Order.findOne({ user: id })
//       .populate("orderItems.product")
//       .populate("user")
//       .exec();
//     res.json(userorders);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const updateOrderStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const updateOrderStatus = await Order.findByIdAndUpdate(
//       id,
//       {
//         orderStatus: status,
//         paymentIntent: {
//           status: status,
//         },
//       },
//       { new: true }
//     );
//     res.json(updateOrderStatus);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getMonthwiseIncome = asyncHandler( async(req, res) => {
//   let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   let d = new Date();
//   let endDate = "";
//   d.setDate(1);
//   for(let index = 0; index < 11; index++){
//     d.setMonth = (d.getMonth() - 1);
//     endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
//   }
//   const data = await Order.aggregate([
//     {
//       $match: {
//         createdAt: {
//           $lte: new Date(),
//           $gte: new Date(endDate)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: {
//           month: "$month"
//         },
//         amount: {$sum:"$totalamountAfterDiscount"},
//         count: {$sum: 1}
//       }
//     }
//   ])
//   res.json(data);
// });
// const getYearlyTotalOrder = asyncHandler( async(req, res) => {
//   let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//   let d = new Date();
//   let endDate = "";
//   d.setDate(1);
//   for(let index = 0; index < 11; index++){
//     d.setMonth = (d.getMonth() - 1);
//     endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
//   }
//   const data = await Order.aggregate([
//     {
//       $match: {
//         createdAt: {
//           $lte: new Date(),
//           $gte: new Date(endDate)
//         }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         count: {$sum: 1},
//         amount: {$sum: "$totalpriceAfterDiscount"}
//       }
//     }
//   ])
//   res.json(data);
// });
module.exports = {
    createStudent, 
    createSME,
    deleteUser, 
    loginUser, 
    getallUsers, 
    getUserById, 
    updateUser,
    blockUser,
    unblockUser,
    // handleRefreshedToken,
    logoutUser,
    // updatePassword,
    forgotPassword,
    resetPassword,
    loginAdmin,
    logoutAdmin,
};
