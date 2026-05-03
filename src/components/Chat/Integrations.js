import axios from "axios";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
const THREAD_KEY = process.env.REACT_APP_AI_THREAD_KEY;

const axiosInstance = axios.create({
  baseURL: "https://api.openai.com/v1",
  headers: {
    "OpenAI-Beta": "assistants=v2",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

export const sendOpenAIMessage = async (content) => {
  try {
    const url = `/threads/${THREAD_KEY}/messages`;
    const response = await axiosInstance.post(url, {
      role: "user",
      content: content,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      `OpenAI API error: ${error.response?.statusText || error.message}`
    );
  }
};

export const runOpenAIThread = async (body) => {
  try {
    const url = `/threads/${THREAD_KEY}/runs`;
    const response = await axiosInstance.post(url, body);
    return response.data;
  } catch (error) {
    throw new Error(
      `OpenAI API error: ${error.response?.statusText || error.message}`
    );
  }
};

export const runStatusLoop = async (runId) => {
  const runStatus = await getOpenAIRunStatus(runId);
  console.log("aguardando status, atual: ", runStatus.status);
  if (runStatus.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await runStatusLoop(runId);
  }
};

export const getOpenAIRunStatus = async (runId) => {
  try {
    const url = `/threads/${THREAD_KEY}/runs/${runId}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `OpenAI API error: ${error.response?.statusText || error.message}`
    );
  }
};

export const getOpenAIMessages = async (runId) => {
  try {
    const url = `/threads/${THREAD_KEY}/messages?run_id=${encodeURIComponent(
      runId
    )}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw new Error(
      `OpenAI API error: ${error.response?.statusText || error.message}`
    );
  }
};
