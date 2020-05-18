var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";
import * as $ from "jquery";
//<div>{{displayYear}}年{{displayMonth + 1}}月</div>
var Calendar = /** @class */ (function () {
    function Calendar() {
        var _this = this;
        this.onDaySelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.events = [];
        this.weekHead = ['日', '一', '二', '三', '四', '五', '六'];
        this.currentYear = moment().year();
        this.currentMonth = moment().month();
        this.currentDate = moment().date();
        this.currentDay = moment().day();
        this.displayYear = moment().year();
        this.selectYear = 0;
        this.displayMonth = moment().month();
        this.selectMonth = 0;
        this.displayDate = moment().date();
        this.displayDay = moment().day();
        this.dateArray = []; // Array for all the days of the month
        this.weekArray = []; // Array for each row of the calendar
        this.lastSelect = 0; // Record the last clicked location
        this.ngMonth = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.pickerOption = {
            buttons: [{
                    text: "今天",
                    handler: function () {
                        _this.today();
                    }
                }]
        };
        this.createMonth(this.displayYear, this.displayMonth);
    }
    Calendar.prototype.ngOnChanges = function () {
        this.createMonth(this.displayYear, this.displayMonth);
    };
    Calendar.prototype.ngAfterContentInit = function () {
        this.today();
    };
    Calendar.prototype.ngAfterViewInit = function () {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
        // $('.day-col').each(function () {
        //     $(this).height($(this).width()+'px');
        // });
    };
    Calendar.prototype.swipeEvnet = function (e) {
        //向左滑
        if (e.direction == 2) {
            this.forward();
        }
        //向右滑
        if (e.direction == 4) {
            this.back();
        }
    };
    // Jump to today
    Calendar.prototype.today = function () {
        this.displayYear = this.currentYear;
        this.selectYear = this.currentYear;
        this.displayMonth = this.currentMonth;
        this.selectMonth = this.currentMonth;
        this.displayDate = this.currentDate;
        this.displayDay = this.displayDay;
        this.createMonth(this.currentYear, this.currentMonth);
        // Mark today as a selection
        var todayIndex = _.findIndex(this.dateArray, {
            year: this.currentYear,
            month: this.currentMonth,
            date: this.currentDate,
            isThisMonth: true
        });
        this.lastSelect = todayIndex;
        this.dateArray[todayIndex].isSelect = true;
        this.onDaySelect.emit(this.dateArray[todayIndex]);
        this.ngMonth = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();
    };
    Calendar.prototype.isInEvents = function (year, month, date) {
        var i = 0, len = this.events.length;
        for (; i < len; i++) {
            if (this.events[i].year == year && this.events[i].month == month && this.events[i].date == date) {
                return true;
            }
        }
        return false;
    };
    Calendar.prototype.createMonth = function (year, month) {
        this.dateArray = []; // Clear last month's data
        this.weekArray = []; // Clear week data
        var firstDay;
        // The day of the week on the first day of the current month of
        // selection determines how many days to take out last month. Sunday
        // does not show last month, Monday shows the previous month, Tuesday
        // shows the last two days
        var preMonthDays; // The number of days for the previous month
        var monthDays; // The number of days for the month
        var weekDays = [];
        firstDay = moment({ year: year, month: month, date: 1 }).day();
        // The number of days last month
        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
        }
        else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
        }
        // The number of days this month
        monthDays = moment({ year: year, month: month }).daysInMonth();
        // PREVIOUS MONTH
        // Add the last few days of the previous month to the array
        if (firstDay !== 7) { // Sunday doesn't need to be shown for the previous month
            var lastMonthStart = preMonthDays - firstDay + 1; // From the last few months start
            for (var i = 0; i < firstDay; i++) {
                if (month === 0) {
                    this.dateArray.push({
                        year: year,
                        month: 11,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, 11, lastMonthStart + i)) ? true : false,
                    });
                }
                else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month - 1, lastMonthStart + i)) ? true : false,
                    });
                }
            }
        }
        // Add the numeral for this month to the array
        for (var i = 0; i < monthDays; i++) {
            this.dateArray.push({
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                hasEvent: (this.isInEvents(year, month, i + 1)) ? true : false,
            });
        }
        if (this.currentYear === year && this.currentMonth === month) {
            var todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true
            });
            this.dateArray[todayIndex].isToday = true;
        }
        // Add the number of days next month to the array, with some months showing 6 weeks and some months showing 5 weeks
        if (this.dateArray.length % 7 !== 0) {
            var nextMonthAdd = 7 - this.dateArray.length % 7;
            for (var i = 0; i < nextMonthAdd; i++) {
                if (month === 11) {
                    this.dateArray.push({
                        year: year,
                        month: 0,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, 0, i + 1)) ? true : false,
                    });
                }
                else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month + 1, i + 1)) ? true : false,
                    });
                }
            }
        }
        // All date data is now added to the dateArray array
        // Insert the date data into the new array every seven days
        for (var i = 0; i < this.dateArray.length / 7; i++) {
            for (var j = 0; j < 7; j++) {
                weekDays.push(this.dateArray[i * 7 + j]);
            }
            this.weekArray.push(weekDays);
            weekDays = [];
        }
    };
    Calendar.prototype.change = function (e) {
        this.displayMonth = e.month - 1;
        this.displayYear = e.year;
        this.createMonth(this.displayYear, this.displayMonth);
    };
    Calendar.prototype.back = function () {
        $('#cal-body').addClass('animated infinite slideInLeft faster');
        setTimeout(function () {
            $('#cal-body').removeClass('animated infinite slideInLeft faster');
        }, 200);
        // Decrementing the year if necessary
        if (this.displayMonth === 0) {
            this.displayYear--;
            this.displayMonth = 11;
        }
        else {
            this.displayMonth--;
        }
        var monthSelect = {
            'year': this.displayYear,
            'month': this.displayMonth
        };
        this.onMonthSelect.emit(monthSelect);
        this.ngMonth = new Date(moment(monthSelect).toDate().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.createMonth(this.displayYear, this.displayMonth);
    };
    Calendar.prototype.forward = function () {
        $('#cal-body').addClass('animated infinite slideInRight faster');
        setTimeout(function () {
            $('#cal-body').removeClass('animated infinite slideInRight faster');
        }, 200);
        // Incrementing the year if necessary
        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        }
        else {
            this.displayMonth++;
        }
        var monthSelect = {
            'year': this.displayYear,
            'month': this.displayMonth
        };
        this.onMonthSelect.emit(monthSelect);
        this.ngMonth = new Date(moment(monthSelect).toDate().getTime() + 8 * 60 * 60 * 1000).toISOString();
        this.createMonth(this.displayYear, this.displayMonth);
    };
    // Select a day, click event
    Calendar.prototype.daySelect = function (day, i, j) {
        // First clear the last click status
        this.dateArray[this.lastSelect].isSelect = false;
        // Store this clicked status
        this.lastSelect = i * 7 + j;
        this.dateArray[i * 7 + j].isSelect = true;
        this.displayDate = moment(day).date();
        this.displayDay = moment(day).day();
        this.selectMonth = moment(day).month();
        this.selectYear = moment(day).year();
        this.onDaySelect.emit(day);
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], Calendar.prototype, "onDaySelect", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], Calendar.prototype, "onMonthSelect", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], Calendar.prototype, "events", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], Calendar.prototype, "weekHead", void 0);
    Calendar = __decorate([
        Component({
            selector: 'ion-calendar',
            template: "\n    <div class=\"cal-head\">\n        <div class=\"head-year\">{{selectYear}}\u5E74</div>\n        <div class=\"head-day\">{{selectMonth+1}}\u6708{{displayDate}}\u65E5\u5468{{weekHead[displayDay]}}</div>\n    </div>\n    <ion-grid id=\"cal-grid\" (swipe)=\"swipeEvnet($event)\">\n        <ion-row justify-content-center>\n            <ion-col class=\"arrow\" col-3 (click)=\"back()\" style=\"text-align:center;\">\n                <ion-icon name=\"ios-arrow-back\"></ion-icon>\n            </ion-col>\n            <ion-col class=\"arrow\" col-6 style=\"text-align:center;\">\n                <ion-datetime (ionChange)=\"change($event)\" displayFormat=\"YYYY\u5E74MM\u6708\" \n                pickerFormat=\"YYYY/MM\" [(ngModel)]=\"ngMonth\" cancelText=\"\u53D6\u6D88\" doneText=\"\u786E\u5B9A\"\n                max=\"2050\" [pickerOptions]=\"pickerOption\"></ion-datetime>\n            </ion-col>\n            <ion-col class=\"arrow\" col-3 (click)=\"forward()\" style=\"text-align:center;\">\n                <ion-icon name=\"ios-arrow-forward\"></ion-icon>\n            </ion-col>\n        </ion-row>\n\n        <ion-row>\n            <ion-col class=\"center calendar-header-col\" *ngFor=\"let head of weekHead\">{{head}}</ion-col>\n        </ion-row>\n\n        <div id=\"cal-body\">\n            <ion-row class=\"calendar-row\" *ngFor=\"let week of weekArray;let i = index\">\n                <ion-col class=\"center calendar-col day-col\" (click)=\"daySelect(day,i,j)\"\n                *ngFor=\"let day of week;let j = index\"\n                [ngClass]=\"[day.isThisMonth?'this-month':'not-this-month',day.isToday?'today':'',day.isSelect?'select':'']\">\n                    <span class=\"daydate\">{{day.date}}</span>\n                    <span class=\"eventBlip\" *ngIf=\"day.hasEvent\"></span>\n                </ion-col>\n            </ion-row>\n        </div>\n        \n\n    </ion-grid>\n"
        }),
        __metadata("design:paramtypes", [])
    ], Calendar);
    return Calendar;
}());
export { Calendar };
//# sourceMappingURL=calendar.js.map