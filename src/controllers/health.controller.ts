import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  async testHealth() {
    return "ok - 2";
  }
}
