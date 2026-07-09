import {
    AcceptBank,
    AcceptConsent,
    AcceptTime,
    DeliveryAddress,
    FullName,
} from "../../fields";
import z from "zod";

export const AcceptSchema = z.object({
    fullName: FullName,
    address: DeliveryAddress,
    time: AcceptTime,
    bank: AcceptBank,
    consent: AcceptConsent,
});

export type AcceptDtoInput = z.input<typeof AcceptSchema>;
export type AcceptDtoOutput = z.infer<typeof AcceptSchema>;
