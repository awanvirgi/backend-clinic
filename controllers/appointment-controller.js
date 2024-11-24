const moment = require("moment");
require('moment/locale/id');
moment.locale('id')

const { Appointment, Patient, Midwafe } = require("../models")

const { Op } = require('sequelize')
const tokengambler = (length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = "";
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
                        "id",
                        "price",
                        "date",
                        "token",
                        "services",
                        "reason",
                        "status",
                        "visit",
                        "payment",
                        "aname",
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
                    "id",
                    "price",
                    "date",
                    "token",
                    "services",
                    "reason",
                    "status",
                    "visit",
                    "payment",
                    "aname",
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
            const { id } = req.params; // Ambil ID dari parameter URL

            // Query untuk menemukan janji temu berdasarkan ID
            const appointment = await Appointment.findOne({
                where: { id }, // Kondisi berdasarkan ID
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'name'], // Atribut yang diambil dari tabel Patient
                    },
                    {
                        model: Midwafe,
                        attributes: ['id', 'name'], // Atribut yang diambil dari tabel Midwafe
                    },
                ],
                attributes: [
                    "id",
                    "price",
                    "date",
                    "token",
                    "services",
                    "reason",
                    "status",
                    "visit",
                    "payment",
                    "aname",
                ], // Atribut yang diambil dari tabel Appointment
            });

            // Jika janji temu tidak ditemukan
            if (!appointment) {
                return res.status(404).json({
                    message: "Janji temu tidak ditemukan",
                });
            }

            // Jika janji temu ditemukan, kembalikan data
            return res.status(200).json({
                message: "Berhasil Menampilkan Detail Janji Temu",
                data: appointment,
            });
        } catch (err) {
            next(err); // Handle error
        }
    },

    addAppointment: async (req, res, next) => {
        try {
            const data = req.body;
            console.log(data);
            const { patient } = data
            const formattedDate = moment(data.date).local().format('YYYY-MM-DD HH:mm:ss');
            if (!moment(formattedDate, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
                return res.status(400).json({ error: 'Invalid date format' });
            }
            const dataToken = tokengambler()
            console.log(dataToken)
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
                    date: formattedDate,
                    token: dataToken,
                    services: data.services,
                    reason: data.reason,
                    status: "Belum",
                    payment: data.payment,
                    visit: data.visit,
                    aname: data.aname
                })
                res.status(201).json({
                    message: "Berhasil menambahkan Appointment",
                    token: Appointment_data.token,
                });
            }
        } catch (err) {
            console.error("Terjadi kesalahan:", err.message);
            res.status(500).json({ error: err.message });
        }
    },
    updateAppointment: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status, price, date, services, reason, payment, visit, aname } = req.body;

            const updateData = {};
            if (status !== undefined) updateData.status = status;
            if (price !== undefined) updateData.price = price;
            if (date !== undefined) updateData.date = date;
            if (services !== undefined) updateData.services = services;
            if (reason !== undefined) updateData.reason = reason;
            if (payment !== undefined) updateData.payment = payment;
            if (visit !== undefined) updateData.visit = visit;
            if (aname !== undefined) updateData.aname = aname;

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