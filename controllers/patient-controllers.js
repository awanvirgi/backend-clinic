const { where } = require("sequelize");
const { Patient } = require("../models");

module.exports = {
    getAllPatient: async (req, res) => {
        try {
            const response = await Patient.findAll({
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

            res.status(200).json({
                message: "Berhasil Menampilkan Data",
                data: response,
            });
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    },



    getPatientperPage: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;

            const response = await Patient.findAndCountAll({
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

            res.status(200).json({
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
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    },



    addPatient: async (req, res) => {
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
            res.status(500).json({
                message: err.message,
            });
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
            },{
                where:{
                    id:id
                }
            })
            res.status(200).json({
                message:"Berhasil mengedit data pasien",
                data:id
            })
        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    },

    
    deletePatient : async (req,res) =>{
        try{
            const {id} = req.params
            await Patient.destroy({
                where:{
                    id:id
                }
            })
            res.status(200).json({
                message:"Berhasil menghapus data pasien"
            })
        }catch(err){
            res.status(500).json({
                message: err.message
            });
        }
    }
    
};
