"use strict";angular.module("userManagementClientApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/users",{templateUrl:"views/users.html",controller:"UsersCtrl"}).when("/usergroups",{templateUrl:"views/usergroups.html",controller:"UsergroupsCtrl"}).otherwise({redirectTo:"/users"})}]),angular.module("userManagementClientApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("userManagementClientApp").controller("UsersCtrl",["$scope","Usersservice","Usergroupsservice",function(a,b,c){a.isShowForm=!1,a.users=b.API.query(),a.user=new b.API,a.groups=c.API.query(),a.showForm=function(){a.isShowForm=!0},a.createUser=function(c,d){c.$save(function(){console.log("Successfully created user ",c.firstName,c.lastName),a.users=b.API.query(),a.user=new b.API,d.$setPristine()},function(b){b.data.errors&&b.data.errors.length&&(a.errors=b.data.errors)})},a.deleteUser=function(c){window.confirm("Are you sure you want to delete this user?")&&c.$remove(function(){console.log("Successfully deleted the user ",c.firstName,c.lastName),a.users=b.API.query()},function(){console.log("Error deleting the user ",c.firstName,c.lastName)})}}]),angular.module("userManagementClientApp").service("Usersservice",["$resource",function(a){this.API=a("http://url-user-management.jit.su/user",{id:"@id"})}]),angular.module("userManagementClientApp").service("Usergroupsservice",["$resource","$http",function(a,b){this.API=a("http://url-user-management.jit.su/usergroup",{id:"@id"},{update:{method:"PUT"}}),this.API.prototype.$addToGroup=function(a){return b({method:"POST",url:["http://url-user-management.jit.su/usergroup/",this.id,"/user/",a].join("")})},this.API.prototype.$removeFromGroup=function(a){return b({method:"DELETE",url:["http://url-user-management.jit.su/usergroup/",this.id,"/user/",a].join("")})}}]),angular.module("userManagementClientApp").controller("UsergroupsCtrl",["$scope","Usersservice","Usergroupsservice",function(a,b,c){a.isShowForm=!1,a.expandedGroups={},a.usersNotInGroup={},a.group=new c.API,a.users=b.API.query(),a.groups=c.API.query(function(b){b.forEach(function(b){a.expandedGroups[b.id]=!1,a.getUsersNotInGroup(b.id)})}),a.showForm=function(){a.isShowForm=!0},a.createGroup=function(b,d){b.$save(function(){console.log("Successfully created group ",b.name),a.groups=c.API.query(),a.group=new c.API,a.getUsersNotInGroup(b.id),d.$setPristine()},function(b){b.data.errors&&b.data.errors.length&&(a.errors=b.data.errors)})},a.toggleGroupUsers=function(b){a.expandedGroups[b.id]=!a.expandedGroups[b.id]},a.deleteGroup=function(b){!b.users.length&&window.confirm("Are you sure you want to delete this group?")&&b.$remove(function(){console.log("Successfully deleted the group ",b.name),a.groups=c.API.query(),delete a.usersNotInGroup[b.id]},function(){console.log("Error deleting the group ",b.name)})},a.getUsersNotInGroup=function(b){var c=!1;a.usersNotInGroup[b]=[];for(var d,e=a.users.length-1;e>=0;e--){d=a.users[e],c=!1;for(var f,g=d.groups.length-1;g>=0;g--)if(f=d.groups[g],f.id===b){c=!0;break}c||a.usersNotInGroup[b].push(d)}return a.usersNotInGroup[b]},a.addToGroup=function(c,d){d.$addToGroup(c).success(function(c){console.log("Successfully addd user to a group! ",c),a.users=b.API.query(function(){d.$get(function(){a.getUsersNotInGroup(d.id)})})}).error(function(a,b,c,d){console.log("Error while adding user to a group! ",a,b,c,d)})},a.removeFromGroup=function(c,d){window.confirm("Are you sure you want to remove "+c.firstName+" "+c.lastName+" from "+d.name+" group?")&&d.$removeFromGroup(c.id).success(function(c){console.log("Successfully removed user from a group! ",c),a.users=b.API.query(function(){d.$get(function(){a.getUsersNotInGroup(d.id)})})}).error(function(a,b,c,d){console.log("Error while removing user from a group! ",a,b,c,d)})}}]);