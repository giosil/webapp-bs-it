/**
 * http://shawnchin.github.com/jquery-cron
 * Version 0.1.4.1
 *
 * Copyright (c) 2010-2013 Shawn Chin.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

declare interface CronOptions {
    initial?: string,
    minuteOpts?: any,
    timeHourOpts?: any,
    domOpts?: any,
    monthOpts?: any,
    dowOpts?: any,
    timeMinuteOpts?: any,
    effectOpts?: any,
    url_set?: string,
    customValues?: any,
    onChange?: any,
    useGentleSelect?: boolean
}

declare interface JQuery {

    cron(options?: CronOptions): JQuery;

}