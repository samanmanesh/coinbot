import express, { Application, Request, Response, Router } from "express";

export interface IController {
  router: Router;
}

export interface IRoute {
  path: string;
  controller: IController;
}
