const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router(),
	version = require("../../package.json").version,
	config = require("../../config");

// Gets profile page
router.get("/", CheckAuth, async function(req, res, next) {
	const userRole = await req.client.getRoles(req.session.user.id);
	const canSee = await req.client.canAccess("roles", req.userInfos.id);
	if(!canSee)
		return next(new Error("You can't access this page"));

	const roles = await req.client.getWhitelistRoles();
	const whitelisted = await req.client.getWhitelistUsers();
	res.render("rolesSettings", {
		role: userRole,
		roles: roles,
		whitelisted: whitelisted,
		ownerID: config.owner.id,
		serverID: config.serverID,
		userDiscord: req.userInfos,
		userSteam: req.session?.passport?.user || req.userInfos.steam,
		translate: req.translate,
		printDate: req.printDate,
		currentURL: `${req.client.config.dashboard.baseURL}/${req.originalUrl}`,
		repoVersion: version,
		allAvaibleRoles: await req.client.getAllAvaibleAccesLevels(),
	});
});

module.exports = router;