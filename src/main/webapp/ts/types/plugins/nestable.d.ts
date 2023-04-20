declare interface JQuery {

    nestable(): JQuery;
    nestable(command: 'serialize'): any;
    nestable(options: { maxDepth?: number, group?: number }): JQuery;

}