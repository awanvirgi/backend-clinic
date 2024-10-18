const { Midwife } = require("../models")

module.exports = {
    getAllMidwife: async (req, res) => {
        try {
            const response = await Midwife.findAll({
                attributes: [
                    "name",
                    "strId",
                    "gender",
                    "specialist",
                    "phoneNumber",
                    "dateOfBirth"
                ]
            })
            if (response.length === null) {
                return res.status(404).json({ message: "Bidan tidak ditemukan" });
            }

            res.status(200).json({
                message: "Berhasil Menampilkan Data",
                data: response,
            });

        }
        catch (err) {
            res.status(500).json({
                message: err.message
            })
        }
    }
}