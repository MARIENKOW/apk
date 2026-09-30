import { Body, Controller, Post } from "@nestjs/common";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { AcceptLeadOutput, AcceptLeadSchema } from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { LeadService } from "@/modules/accept/lead.service";

const { path } = FULL_PATH_ENDPOINT.accept;

@Controller(path)
export class AcceptController {
  constructor(private lead: LeadService) {}

  // Публичный приём заявки с сайта → карточки в двух Telegram-группах.
  @Post()
  @Public()
  submit(
    @Body(new ZodValidationPipe(AcceptLeadSchema))
    body: AcceptLeadOutput,
  ): Promise<void> {
    return this.lead.create(body);
  }
}
