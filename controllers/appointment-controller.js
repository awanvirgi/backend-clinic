const { Appointment, Patient, Midwafe } = require("../models")

const { Op } = require('sequelize')
const tokengambler = (length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}

module.exports = {
    getAppointment: async (req, res, next) => {
        try {
            const search = req.query.name;
            const page = parseInt(req.query.page) || null;
            const limit = parseInt(req.query.limit) || null;
            const condition = search ? { token: { [Op.like]: `%${search}%` } } : {};
            if (page && limit) {
                const offset = (page - 1) * limit;
                const response = await Appointment.findAndCountAll({
                    where: condition,
                    include: [
                        {
                            model: Patient,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Midwafe,
                            attributes: ['id', 'name']
                        }
                    ],
                    attributes: [
                        "price",
                        "date",
                        "token",
                        "services",
                        "reason",
                        "status"
                    ],
                    limit: limit,
                    offset: offset,
                });

                if (response.rows.length === 0 || !response) {
                    return res.status(404).json({ message: "Janji Temu tidak ditemukan" });
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
            }
            const response = await Appointment.findAll({
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Midwafe,
                        attributes: ['id', 'name']
                    }
                ],
                attributes: [
                    "price",
                    "date",
                    "token",
                    "services",
                    "reason",
                    "status"
                ],
            });

            if (response.length === 0) {
                return res.status(404).json({ message: "Janji tidak ditemukan" });
            }

            return res.status(200).json({
                message: "Berhasil Menampilkan Semua Data",
                data: response,
            });
        } catch (err) {
            next(err)
        }
    },
    getAppointmentById: async (req, res, next) => {
        try {
            const { id } = req.params
            const Appointment_data = await Appointment.findOne({
                where: {
                    id: id
                },
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Midwafe,
                        attributes: ['id', 'name']
                    }
                ],
                attributes: [
                    "price",
                    "date",
                    "token",
                    "services",
                    "reason",
                    "status"
                ],
            })
            if (Appointment_data == null) {
                return res.status(404).json({ message: "Janji Temu tidak ditemukan" });
            }
            res.status(200).json({
                message: "Berhasil menemukan Janji temu data",
                data: Appointment_data
            })
        } catch (err) {
            next(err)
        }
    },
    addAppointment: async (req, res, next) => {
        try {
            const data = req.body;
            const { patient } = data
            let patient_data = await Patient.create({
                name: patient.name,
                gender: patient.gender,
                address: patient.address,
                dateOfBirth: patient.dateOfBirth,
                email: patient.email,
                phoneNumber: patient.phoneNumber,
                martialStatus: patient.martialStatus,
            });
            if (patient_data.id) {
                let Appointment_data = await Appointment.create({
                    patientId: patient_data.id,
                    doctorId: data.midwife_id,
                    price: data.price,
                    date: data.date,
                    token: tokengambler,
                    services: data.services,
                    reason: data.reason,
                    status: "Belum"
                })
                res.status(201).json({
                    message: "Berhasil menambahkan Appointment",
                    token: Appointment_data.token,
                });
            }
        } catch (err) {
            next(err)
        }
    },
    updateAppointment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status, price, date, services, reason } = req.body;

            const updateData = {};
            if (status !== undefined) updateData.status = status;
            if (price !== undefined) updateData.price = price;
            if (date !== undefined) updateData.date = date;
            if (services !== undefined) updateData.services = services;
            if (reason !== undefined) updateData.reason = reason;

            await Appointment.update(updateData, {
                where: { id: id }
            });

            const message = status !== undefined
                ? "Berhasil merubah Status Appointment"
                : "Berhasil Edit Janji Temu";

            res.status(200).json({
                message: message,
                data: id
            });
        } catch (err) {
            next(err);
        }
    },
    deleteAppointment: async (req, res, next) => {
        try {
            const { id } = req.params
            await Appointment.destroy({
                where: {
                    id: id
                }
            })
            res.status(200).json({
                message: "Berhasil menghapus data Janji Temu"
            })
        } catch (err) {
            next(err)
        }
    }
}