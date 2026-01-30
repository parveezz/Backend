let users = []; // temporary in-memory storage

// GET - fetch all users
exports.getUsers = (req, res) => {
      res.json(users);
};

// POST - create new user
exports.createUser = (req, res) => {
      const user = {
            id: Date.now(),
            ...req.body,
      };
      users.push(user);
      res.status(201).json(user);
};

// PUT - full update
exports.updateUser = (req, res) => {
      users = users.map((u) =>
            u.id == req.params.id ? { ...req.body, id: u.id } : u
      );
      res.json({ message: "User fully updated" });
};

// PATCH - partial update
exports.patchUser = (req, res) => {
      users = users.map((u) =>
            u.id == req.params.id ? { ...u, ...req.body } : u
      );
      res.json({ message: "User partially updated" });
};

// DELETE - remove user
exports.deleteUser = (req, res) => {
      users = users.filter((u) => u.id != req.params.id);
      res.json({ message: "User deleted" });
};

// OPTIONS - allowed methods
exports.optionsHandler = (req, res) => {
      res.set("Allow", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.sendStatus(204);
};
