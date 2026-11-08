import axios from "axios";
import { errorHandler } from "../utils/error-handler";
import { patientsUrl, patientUrl,patientCenterUrl } from "../utils/urls";
import axiosInstance from "../utils/axios-instance";

const createPatient = async (payload) => {
  return axiosInstance
    .post(patientsUrl, payload)
    .then(res => res.data)
    .catch(errorHandler);
};

const getPatients = async (params) => {
  return axiosInstance
    .get(patientsUrl, { params })
    .then(res => res.data)
    .catch(errorHandler);
};

const getPatientById = async (id) => {
  return axiosInstance
    .get(patientUrl(id))
    .then(res => res.data)
    .catch(errorHandler);
};

const updatePatient = async (id, payload) => {
  return axios
    .put(patientUrl(id), payload)
    .then(res => res.data)
    .catch(errorHandler);
};

const deletePatient = async (id) => {
  return axios
    .delete(patientUrl(id))
    .then(res => res.data)
    .catch(errorHandler);
};

const getPatientsByCenter = async (centerId) => {
  return axiosInstance
    .get(patientCenterUrl(centerId))
    .then(res => res.data)
    .catch(errorHandler);
};


export const PatientService = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientsByCenter,
};
