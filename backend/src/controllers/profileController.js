// Mock DB reference (in a real app, this would be a model)
const users = [];

exports.setupProfile = (req, res) => {
    const { phoneNumber, name, photo, type } = req.body;
    const newUser = { phoneNumber, name, photo, type, isPremium: false };
    users.push(newUser);
    res.status(200).json({ message: 'Profile setup successful', user: newUser });
};

exports.getUsers = (req, res) => {
    res.status(200).json(users);
};
