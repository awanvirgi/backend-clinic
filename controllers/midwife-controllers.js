const { Midwafe } = require("../models")

module.exports = {
    getAllMidwafe: async (req, res, next) => {
        try {
            const search = req.query.name;
            const page = parseInt(req.query.page) || null;
            const limit = parseInt(req.query.limit) || null;
            const condition = search ? { name: { [Op.like]: `%${search}%` } } : {};

            // Jika ada page dan limit, lakukan paginasi
            if (page && limit) {
                const offset = (page - 1) * limit;
                const response = await Midwafe.findAndCountAll({
                    where: condition,
                    attributes: [
                        "name",
                        "strId",
                        "gender",
                        "specialist",
                        "phoneNumber",
                        "dateOfBirth",
                    ],
                    limit: limit,
                    offset: offset,
                });

                if (response.rows.length === 0) {
                    return res.status(404).json({ message: "Bidan tidak ditemukan" });
                }

                // Pagination data
                const totalPages = Math.ceil(response.count / limit);
                const nextPage = page < totalPages ? page + 1 : null;
                const prevPage = page > 1 ? page - 1 : null;

                return res.status(200).json({
                    message: "Berhasil Menampilkan Data per Page",
                    data: response.rows,
                    pagination: {
                        totalItems: response.count,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                        nextPage: nextPage,
                        prevPage: prevPage,
                    },
                });
            } else {
                // Jika tidak ada page dan limit, ambil semua data
                const response = await Midwafe.findAll({
                    where: condition,
                    attributes: [
                        "name",
                        "strId",
                        "gender",
                        "specialist",
                        "phoneNumber",
                        "dateOfBirth",
                    ],
                });

                if (response.length === 0) {
                    return res.status(404).json({ message: "Bidan tidak ditemukan" });
                }

                return res.status(200).json({
                    message: "Berhasil Menampilkan Semua Data",
                    data: response,
                });
            }
        } catch (err) {
            next(err);
        }
    },

    getMidWafeById : async(req,res,next)=>{
        try{
            const {id} = req.params
            const Midwafe_data = await Midwafe.findByPk(id)
            if(Midwafe_data == NULL){
                return res.status(404).json({ message: "Bidan tidak ditemukan" });
            }
            return res.status(200).json({
                message:"Berhasil Menampilkan Data Bidan",
                data:Midwafe_data
            })
        }catch(err){
            next(err)
        }
    },
    




    addMidwafe: async (req, res, next) => {
        try {
            const data = req.body;
            let Midwafe_data = await Midwafe.create({
                name: data.name,
                gender: data.gender,
                strId: data.strId,
                specialist: data.specialist,
                phoneNumber: data.phoneNumber,
                dateOfBirth: data.dateOfBirth,
            });
            res.status(201).json({
                message: "Berhasil menambahkan Data Bidan",
                data: Midwafe_data,
            });
        } catch (err) {
            next(err)
        }
    },
    editMidwafe: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await Midwafe.update({
                name: data.name,
                gender: data.gender,
                strId: data.strId,
                specialist: data.specialist,
                phoneNumber: data.phoneNumber,
                dateOfBirth: data.dateOfBirth,
            }, {
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Berhasil mengedit data Bidan",
                data: id
            })
        } catch (err) {
            next(err)
        }
    },

    deleteMidwafe: async (req, res, next) => {
        try {
            const { id } = req.params
            await Midwafe.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Berhasil menghapus data Bidan"
            })
        } catch (err) {
            next(err)
        }
    }
}