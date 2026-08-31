import { DeviceInfoDto, LocationDto } from "../deviceGeo";

export interface SessionViewDto {
    id: string;
    isCurrent: boolean;
    device: DeviceInfoDto;
    location: LocationDto;
    createdAt: string;
    lastUsedAt: string;
}
