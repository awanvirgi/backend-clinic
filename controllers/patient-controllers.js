const { Patient } = require("../models");
const { Op } = require('sequelize');

module.exports = {
    getAllPatient: async (req, res, next) => {
        try {
            const search = req.query.name;
            const condition = search ? { name: { [Op.like]: `%${search}%` } } : {}
            const page = parseInt(req.query.page) || null;
            const limit = parseInt(req.query.limit) || null;

            if (page && limit) {
                const offset = (page - 1) * limit;
                const response = await Patient.findAndCountAll({
                    where: condition,
                    attributes: [
                        "name",
                        "gender",
                        "address",
                        "dateOfBirth",
                        "email",
                        "phoneNumber",
                        "martialStatus",
                    ],
                    limit: limit,
                    offset: offset,
                });

                if (response.rows.length === 0) {
                    return res.status(404).json({ message: "Pasien tidak ditemukan" });
                }

                //pagination data
                const totalPages = Math.ceil(response.count / limit);
                const pages = Array.from({ length: totalPages }, (v, i) => i + 1);
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
                        pages: pages,
                    },
                });

            }
            const response = await Patient.findAll({
                where: condition,
                attributes: [
                    "name",
                    "gender",
                    "address",
                    "dateOfBirth",
                    "email",
                    "phoneNumber",
                    "martialStatus",
                ],
            });

            if (response.length === null) {
                return res.status(404).json({ message: "Pasien tidak ditemukan" });
            }

            return res.status(200).json({
                message: "Berhasil Menampilkan Data",
                data: response,
            });
        } catch (err) {
            next(err)
        }
    },

    getPatientById : async(req,res,next)=>{
        try{
            const {id} = req.params
            const patient_data = await Patient.findByPk(id)
            if(patient_data == NULL){
                return res.status(404).json({ message: "Pasien tidak ditemukan" });
            }
            return res.status(200).json({
                message:"Berhasil Menampilkan Data Pasien",
                data:patient_data
            })
        }catch(err){
            next(err)
        }
    },


    addPatient: async (req, res, next) => {
        try {
            const data = req.body;
            let patient_data = await Patient.create({
                name: data.name,
                gender: data.gender,
                address: data.address,
                dateOfBirth: data.dateOfBirth,
                email: data.email,
                phoneNumber: data.phoneNumber,
                martialStatus: data.martialStatus,
            });
            res.status(201).json({
                message: "Berhasil menambahkan Pasien",
                data: patient_data,
            });
        } catch (err) {
            next(err)
        }
    },


    editPatient: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await Patient.update({
                name: data.name,
                gender: data.gender,
                address: data.address,
                dateOfBirth: data.dateOfBirth,
                email: data.email,
                phoneNumber: data.phoneNumber,
                martialStatus: data.martialStatus,
            }, {
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Berhasil mengedit data pasien",
                data: id
            })
        } catch (err) {
            next(err)
        }
    },


    deletePatient: async (req, res, next) => {
        try {
            const { id } = req.params
            await Patient.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Berhasil menghapus data pasien"
            })
        } catch (err) {
            next(err)
        }
    }

};
