import {
  sendOpenAIMessage,
  runOpenAIThread,
  getOpenAIRunStatus,
  getOpenAIMessages,
  runStatusLoop,
} from "./Integrations";

const ASSISTANT_ID = process.env.REACT_APP_ASSISTANT_ID;

const MensagemAssistant = async (question) => {
  const message = await sendOpenAIMessage(question);
  console.log(message.id);

  const run_payload = {
    assistant_id: ASSISTANT_ID,
    additional_instructions: null,
    tool_choice: null,
  };

  const run = await runOpenAIThread(run_payload);
  console.log(run.id);

  const run_status = await getOpenAIRunStatus(run.id);
  console.log(run_status.status);

  await runStatusLoop(run.id);

  const response = await getOpenAIMessages(run.id);
  const messageResponse =
    response?.data[0]?.content[0]?.text?.value || "Não encontrado";
  console.log(messageResponse);
  return messageResponse;
};

export default MensagemAssistant;
