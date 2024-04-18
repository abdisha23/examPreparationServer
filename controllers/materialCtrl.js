const AsyncHandler = require('express-async-handler');
const Material = require('../models/materialModel.js');
const upload = require('../utils/multerConfig');

const createMaterial = AsyncHandler(async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }

      const { title, description, subject } = req.body;
      const pdfFile = req.file;

      console.log('req.body:', req.body);
      console.log('req.file:', req.file);

      if (!pdfFile) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const material = await Material.create({
        title,
        description,
        subject,
        file: {
          data: pdfFile.buffer, // Store the file path
          contentType: pdfFile.mimetype,
          filename: pdfFile.originalname
        }
      });

      res.status(201).json(material);
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

module.exports = { createMaterial };
// const getallMaterials = AsyncHandler(async (req, res) => {
//   try {
//     const Material = await Material.find();
//     res.status(200).json(Material);
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Failed to load the Material!' });
//   }
// });
// const getMaterialById = AsyncHandler(async (req, res) => {
//     const MaterialId = req.params.MaterialId;
//   try {
//     const Material = await Material.findById(MaterialId);
//     if(!Material){
//         return res.status(404).json({ error: 'Material not found with this id!' });
//     }
//     res.status(200).json(Material);
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: 'Failed to load the Material!' });
//   }
// });
// const deleteMaterial = AsyncHandler(async (req, res) => {
//     const MaterialId = req.params.MaterialId;
//     try {
//       // Delete the Material directly
//       const deletedMaterial = await Material.findByIdAndDelete(MaterialId);
//       if (!deletedMaterial) {
//         return res.status(404).json({ error: 'Material not found with this id!' });
//       }
//       res.status(200).json(deletedMaterial);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Failed to delete the Material!' });
//     }
//   });
// const updateQuestion = AsyncHandler(async (req, res) => {
//     try {
//       const MaterialId = req.params.MaterialId;
//       const updatedQuestions = req.body.questions; // Assuming the updated questions are sent in the request body
//       const Material = await Material.findById(MaterialId);
//       if (!Material) {
//         return res.status(404).json({ error: 'Material not found with this id!' });
//       }
  
//       // Update the existing questions
//       Material.questions = Material.questions.map((currentQuestion) => {
//         const updatedQuestion = updatedQuestions.find((q) => q._id.toString() === currentQuestion._id.toString());
//         if (updatedQuestion) {
//           currentQuestion.question = updatedQuestion.question;
//           currentQuestion.options = updatedQuestion.options;
//           currentQuestion.answer = updatedQuestion.answer;
//         }
//         return currentQuestion;
//       });
  
//       await Material.save();

//       return res.status(200).json({ message: 'Material updated successfully!' });
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to update the Material!' });
//     }
//   });
//   const deleteQuestion = AsyncHandler(async (req, res) => {
//     try {
//       const MaterialId = req.params.MaterialId;
//       const questionId = req.params.questionId;
  
//       // Find the Material
//       const Material = await Material.findById(MaterialId);
//       if (!Material) {
//         return res.status(404).json({ error: 'Material not found with this id!' });
//       }
  
//       // Find the index of the question to be deleted
//       const questionIndex = Material.questions.findIndex((q) => q._id.toString() === questionId);
//       if (questionIndex === -1) {
//         return res.status(404).json({ error: 'Question not found with this id!' });
//       }
  
//       // Remove the question from the Material's questions array
//       const deletedQuestion = Material.questions.splice(questionIndex, 1)[0];
  
//       // Save the updated Material
//       await Material.save();
  
//       // Return the deleted question
//       return res.status(200).json(deletedQuestion);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ error: 'Failed to delete the question!' });
//     }
//   });

//   const addQuestion = AsyncHandler(async(req, res) => {
//     const MaterialId = req.params.MaterialId;
//     let newQuestions = req.body.questions;
//     const Material = await Material.findById(MaterialId);

// if (!Material) {
//   return res.status(404).json({ error: 'Material not found' });
// }

// const currentQuestions = Material.questions;

// const updatedQuestions = [...currentQuestions, ...newQuestions]; // Merge existing and new questions, or apply desired modifications

// Material.questions = updatedQuestions;

// try {
//   await Material.save();
//   return res.status(200).json({ message: 'Material updated successfully' });
// } catch (error) {
//   return res.status(500).json({ error: 'Failed to update Material' });
// }

//   })
module.exports = { 
    createMaterial, 
    // getallMaterials, 
    // getMaterialById, 
    // updateQuestion, 
    // addQuestion, 
    // deleteMaterial,
    // deleteQuestion 
};