import Restaurant from '../models/Restaurant.js';
const getRestaurantById = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json({ success: true, data: restaurant });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
export { getRestaurantById };