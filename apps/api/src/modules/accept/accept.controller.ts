import { Body, Controller, Post } from "@nestjs/common";
import { FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import { AcceptLeadSchema, AcceptLeadOutput } from "@myorg/shared/form";
import { ZodValidationPipe } from "@/common/pipe/zod-validation";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { AcceptService } from "@/modules/accept/accept.service";

const { path } = FULL_PATH_ENDPOINT.accept;

@Controller(path)
export class AcceptController {
  constructor(private accept: AcceptService) {}

  // Публичный приём заявки (iphone-флоу) → отправка в Telegram.
  @Post()
  @Public()
  submit(
    @Body(new ZodValidationPipe(AcceptLeadSchema))
    body: AcceptLeadOutput,
  ): Promise<void> {
    return this.accept.submit(body);
  }
}
