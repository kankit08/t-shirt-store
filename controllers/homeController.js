exports.home = (req, res) => {
  res.status(200).json({
    success: true,
    greetings: "Hello from T-shirt Store",
  });
};

exports.dummyPage = (req, res) => {
  res.status(200).json({
    success: true,
    greetings: "Greetings message from Dummy Page",
  });
};
