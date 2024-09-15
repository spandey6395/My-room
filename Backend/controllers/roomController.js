import Room from "../models/room.js";

// Create a new Room
export const createRoom = async (req, res) => {
  try {
    const { capacity, features, username, mobile, date, roomId } = req.body;

    // Check if the roomId already exists
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res
        .status(400)
        .json({ error: "Room with this roomId already exists" });
    }

    // Create new room
    const newRoom = new Room({
      capacity,
      features,
      username,
      mobile,
      date,
      roomId,
    });
    await newRoom.save();

    return res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error.message);
    return res.status(500).json({ error: "Server error while creating room" });
  }
};

// Search for rooms based on features or roomId
export const searchRoom = async (req, res) => {
  try {
    const { features, roomId } = req.query;

    // Find rooms based on either features or roomId
    const query = {};

    if (roomId) {
      query.roomId = roomId;
    } else if (features) {
      query.features = { $in: features.split(",") };
    }

    const rooms = await Room.find(query);

    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }

    return res.status(200).json({ rooms });
  } catch (error) {
    console.error("Error searching rooms:", error.message);
    return res
      .status(500)
      .json({ error: "Server error while searching rooms" });
  }
};
