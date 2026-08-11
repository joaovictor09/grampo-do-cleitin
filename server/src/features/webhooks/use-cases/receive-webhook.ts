import { WebhookBroker } from "@/http/protocols/webhook-broker";
import { CreateWebhookLogDTO } from "../dtos/create-webhook-log-dto";
import { WebhookLogRepository } from "../repositories/webhooks-log-repository";
import { UseCase } from "@/core/protocols/use-case";
import { WebhookLog } from "../entities/webhook-log";

type ReceiveWebhookUseCaseRequest = {
  webhook: CreateWebhookLogDTO
}

type ReceiveWebhookUseCaseResponse = {
  webhookLog: WebhookLog
}

export class ReceiveWebhookUseCase implements UseCase<ReceiveWebhookUseCaseRequest, ReceiveWebhookUseCaseResponse> {
  constructor(
    private readonly webhooksRepository: WebhookLogRepository,
    private readonly webhookBroker: WebhookBroker
  ) {}

  async execute({ webhook }: ReceiveWebhookUseCaseRequest) {
    const webhookLog = await this.webhooksRepository.save(webhook)

    this.webhookBroker.publish(webhook.webhookId, webhookLog)

    return {
      webhookLog
    }
  }
}