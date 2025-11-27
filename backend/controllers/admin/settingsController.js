import Settings from "../../models/settings/settings.js";

export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne({ where: { id: 1 } });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching settings" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne({ where: { id: 1 } });

        const {
            business_name,
            contact_email,
            contact_phone,
            tax_rate,
            currency,
            appearance,
        } = req.body;

        if (req.file) {
            settings.logo_path = "uploads/" + req.file.filename;
        }

        settings.business_name = business_name;
        settings.contact_email = contact_email;
        settings.contact_phone = contact_phone;
        settings.tax_rate = tax_rate;
        settings.currency = currency;
        settings.appearance = appearance;

        await settings.save();

        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: "Error updating settings" });
    }
};
