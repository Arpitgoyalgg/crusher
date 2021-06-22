import {JsonController, Get, Authorized, Body, Post, Param} from "routing-controllers";
import { Service, Container, Inject } from "typedi";
import DBManager from "../../core/manager/DBManager";
import UserService from "../../core/services/UserService";
import ProjectService from "../../core/services/ProjectService";

import DraftInstanceService from "../../core/services/DraftInstanceService";

@Service()
@JsonController("/draft_instance/")
export class TestInstanceController {
	@Inject()
	private userService: UserService;
	@Inject()
	private draftInstanceService: DraftInstanceService;
	@Inject()
	private projectService: ProjectService;

	private dbManager: DBManager;

	constructor() {
		// This passes on only one DB containers
		this.dbManager = Container.get(DBManager);
	}

	@Authorized()
    @Post("/create")
    async createDraftInstance() {
        return {};
    }

	@Authorized()
    @Get("/getAll/:draftTestId")
    async getAllDraftInstances(@Param("draftTestId") draftTestId: number) {
        return this.draftInstanceService.getAllDraftInstances(draftTestId);
    }

	@Authorized()
    @Post("/updateDraftInstance/:id")
    async updateDraftInstance(@Param("id") draftInstanceId: number, @Body() body) {
        const { status } = body;

        return this.draftInstanceService.updateDraftInstanceStatus(status, draftInstanceId);
    }
}
