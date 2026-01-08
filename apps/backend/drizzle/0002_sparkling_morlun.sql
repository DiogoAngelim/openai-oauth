CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"prompt" varchar(4000) NOT NULL,
	"response" varchar(4000) NOT NULL,
	"model" varchar(255),
	"created_at" timestamp with time zone DEFAULT now()
);
