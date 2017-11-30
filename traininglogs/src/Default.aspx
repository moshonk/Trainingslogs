﻿<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink Name="sp.runtime.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink Name="sp.taxonomy.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />
    <!-- Add your CSS styles to the following file -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.2.0/css/font-awesome.css" />
    <link rel="stylesheet" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
    <link rel="stylesheet" href="http://ui-grid.info/release/ui-grid.css" />
    <link rel="stylesheet" href="css/angucomplete-alt.css" />
    <link rel="stylesheet" href="common/directives/mfb/mfb.min.css" />
    <link rel="stylesheet" href="css/style.css" />
  
    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script type="text/javascript" src="https://code.angularjs.org/1.4.12/angular.js"></script>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-route.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.2/angular-animate.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/lodash@4.17.4/lodash.min.js"></script>
    <script type="text/javascript" src="http://ui-grid.info/release/ui-grid.js"></script>
    <script type="text/javascript" src="http://ui-grid.info/docs/grunt-scripts/csv.js"></script>
    <script type="text/javascript" src="http://ui-grid.info/docs/grunt-scripts/pdfmake.js"></script>
    <script type="text/javascript" src="http://ui-grid.info/docs/grunt-scripts/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="https://ghiden.github.io/angucomplete-alt/js/libs/angucomplete-alt.js"></script>
    <script type="text/javascript" src="../vendor/angular-ui/bootstrap/ui-bootstrap-dialogs.js"></script>

    <script type="text/javascript" src="common/directives/mfb/mfb-directive.js"></script>

    <script type="text/javascript" src="common/services/utililities.js"></script>
    <!-- Models -->
    <script type="text/javascript" src="common/resources/positions.js"></script>
    <script type="text/javascript" src="common/resources/locations.js"></script>
    <script type="text/javascript" src="common/resources/departments.js"></script>
    <script type="text/javascript" src="common/resources/people.js"></script>
    <script type="text/javascript" src="common/resources/trainings.js"></script>
    <script type="text/javascript" src="common/resources/traininglogs.js"></script>
    <script type="text/javascript" src="common/resources/trainingattendances.js"></script>
    <script type="text/javascript" src="common/resources/trainingreports.js"></script>
    <!-- Controllers -->
    <script type="text/javascript" src="app/traininglogs/trainings/trainings.js"></script>
    <script type="text/javascript" src="app/traininglogs/traininglogs.js"></script>
    <script type="text/javascript" src="app/traininglogs/reports/reports.js"></script>

    <script type="text/javascript" src="app/app.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
   <!-- Trainings Logs Application-->
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div class="container-fluid" data-ng-app="app">
        <h1>Trainings Log Application</h1>
        <div data-ng-view=""></div>
        <div ng-include src="'app/mfb-buttons.tpl.html'"></div>
    </div>

</asp:Content>
