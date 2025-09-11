// Imports global types
import '@twilio-labs/serverless-runtime-types';
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
  ServerlessEventObject,
} from '@twilio-labs/serverless-runtime-types/types';
import axios from "axios";
import { GameState, addAttempt, AddAttemptError, getFormattedState } from "../core/wordle-core"

type MyEvent = {
  From?: string;
  Body?: string;
};

type MyContext = {
  GREETING?: string;
};

const baseURL = "https://www.nytimes.com/svc/wordle/v2/"

const getURL = (date: Date) =>
  baseURL + date.toISOString().split("T")[0] + ".json";

const getSolution = async (date: Date) => {
  const response = await axios.get(getURL(date));
  const { solution } = response.data;
  return solution;
}

export const handler: ServerlessFunctionSignature = async function (
  context: Context<MyContext>,
  event: ServerlessEventObject<MyEvent>,
  callback: ServerlessCallback
) {
  const client = context.getTwilioClient()
  const twiml = new Twilio.twiml.MessagingResponse();
  const phoneNumber = event.From || '+15105550100';
  const incomingMessage = event.Body?.toLowerCase().slice(0, 5) ?? "aaaaa";

  try {
    const date = new Date()
    let startOfDay = new Date(date)
    startOfDay.setMinutes(0)
    startOfDay.setHours(0)
    let endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    const solution = await getSolution(date)
    const lastMessages = await client.messages.list({
      from: phoneNumber,
      dateSentBefore: endOfDay,
      dateSentAfter: startOfDay,
      limit: 20
    })
    lastMessages.reverse()
    const state = lastMessages.map(x => x.body).reduce(
      (state: GameState, message: string) => addAttempt(message)(state)[0], 
      { attempts: [], solution }
    )

    const [newState, error] = addAttempt(incomingMessage)(state)
    const formatted = getFormattedState(newState)
    switch (error) {
      case AddAttemptError.notAWord:
        twiml.message(incomingMessage + ": not a word")
      case AddAttemptError.gameIsOver:
        twiml.message("Game over, come back tomorrow!")
      case null:
	twiml.message(formatted)
    }

    callback(null, twiml);
  } catch (error) {
    console.error(error);
    return callback(error as Error);
  }
};
