import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations = await sql`
      SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    const currentLikes = Array.isArray(creation.likes) ? creation.likes : [];
    const userIdStr = String(userId);

    let updatedLikes;
    let message;
    let action; // like or unlike

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = 'Creation Unliked';
      action = 'unlike';
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = 'Creation Liked';
      action = 'like';
    }

    const formattedArray = `{${updatedLikes.join(',')}}`;
    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.status(200).json({
      success: true,
      action,
      message,
      likes: updatedLikes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
