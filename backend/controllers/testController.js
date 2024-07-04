import Test from '../models/Test.js';

export const getTestByTitle = async (req, res) => {
  const { title } = req.params;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const test = await Test.findOne({ title });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
