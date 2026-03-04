import apiClient from "../apiservice";

const getAllAnalyses = async () => {
  const response = await apiClient.get("/analyses/");
  return response.data;
};

const initialiseAnalysis = async (data: any) => {
  const response = await apiClient.post("/analyses/", data);
  return response.data;
};

const getOneAnalyse = async (slug: string) => {
  const response = await apiClient.get(`/analyses/${slug}/`);
  return response.data;
};

const deleteOneAnalyse = async (slug: string) => {
  const response = await apiClient.delete(`/analyses/${slug}/`);
  return response.data;
};

const updateAnalyse = async (slug: string, data: any) => {
  const response = await apiClient.put(`/analyses/${slug}/`, data);
  return response.data;
};

const analyseWorkshop = async (slug: string, data: any) => {
  const response = await apiClient.delete(
    `/analyses/${slug}/update-workshop/`,
    data,
  );
  return response.data;
};

const iaAssets = async (data: any) => {
  const response = await apiClient.post(`/ai/assets`, { contexte: data });
  return response.data;
};

const iaMeasuares = async (data: any) => {
  const response = await apiClient.post(`/ai/measures/`, { risks: data });
  return response.data;
};

const iaScenarios = async (data: any) => {
  const response = await apiClient.post(`/ai/scenarios/`, data);
  return response.data;
};

const iaSwot = async (data: any) => {
  const response = await apiClient.post(`/ai/swot/`, { context: data });
  return response.data;
};

const analysisService = {
  getAllAnalyses,
  initialiseAnalysis,
  getOneAnalyse,
  deleteOneAnalyse,
  updateAnalyse,
  analyseWorkshop,
  iaAssets,
  iaMeasuares,
  iaScenarios,
  iaSwot,
};
export default analysisService;
