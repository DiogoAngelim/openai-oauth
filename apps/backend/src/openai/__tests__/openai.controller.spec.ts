import { OpenAIController } from "../openai.controller";
import { OpenAIService } from "../openai.service";

describe("OpenAIController", () => {
  let controller: OpenAIController;
  let openai: {
    createChatCompletion: jest.Mock;
    getUserChatHistory: jest.Mock;
  };

  beforeEach(() => {
    openai = {
      createChatCompletion: jest.fn().mockResolvedValue("result"),
      getUserChatHistory: jest.fn().mockResolvedValue(["history"]),
    };
    controller = new OpenAIController(openai as unknown as OpenAIService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should handle chat with stream=false", async () => {
    const req = {
      user: { orgId: "org1", sub: "user1" },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as import("express").Request & {
      user: { orgId: string; sub: string };
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn(),
    } as unknown as import("express").Response;
    const body = { prompt: "Hello" };
    await controller.chat(req, res, body, "false");
    expect(openai.createChatCompletion).toHaveBeenCalledWith(
      "org1",
      "user1",
      body,
      false,
    );
    expect(res.json).toHaveBeenCalledWith("result");
  });

  it("should handle chat with stream=true", async () => {
    const req = {
      user: { orgId: "org1", sub: "user1" },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as import("express").Request & {
      user: { orgId: string; sub: string };
    };
    const res = {
      setHeader: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn(),
    } as unknown as import("express").Response;
    const body = { prompt: "Hello" };
    openai.createChatCompletion.mockImplementation(
      async (_orgId, _userId, _body, _stream, cb) => {
        cb("chunk1");
        cb("chunk2");
      },
    );
    await controller.chat(req, res, body, "true");
    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "text/event-stream",
    );
    expect(res.write).toHaveBeenCalledWith("data: chunk1\n\n");
    expect(res.write).toHaveBeenCalledWith("data: chunk2\n\n");
    expect(res.end).toHaveBeenCalled();
  });

  it("should get chat history", async () => {
    const req = {
      user: { orgId: "org1", sub: "user1" },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
    } as unknown as import("express").Request & {
      user: { orgId: string; sub: string };
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
      sendStatus: jest.fn(),
      links: jest.fn(),
      send: jest.fn(),
    } as unknown as import("express").Response;
    await controller.getHistory(req, res);
    expect(openai.getUserChatHistory).toHaveBeenCalledWith("org1", "user1");
    expect(res.json).toHaveBeenCalledWith(["history"]);
  });
});
