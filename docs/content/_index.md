+++
title = "selfoss – the open source web based rss reader and multi source mashup aggregator"
+++

# Documentation

## Requirements {#requirements}
<div class="documentation-entry">

selfoss is not a hosted service. It has to be installed on your own web server. This web server must fulfil the following requirements (which are available from most providers)

* PHP 5.6 or higher with the `php-gd` and `php-http` extensions enabled. Some spouts may also require `curl` or `mbstring` extensions. The `php-imagick` extension is required if you want selfoss to support SVG site icons.
* MySQL 5.5.3 or higher, PostgreSQL, or SQLite
* Apache web server (nginx and Lighttpd also possible)

With Apache, ensure that you have `mod_authz_core`, `mod_rewrite` and `mod_headers` enabled and that `.htaccess` files are [allowed](http://httpd.apache.org/docs/current/mod/core.html#allowoverride) to set rewrite rules.

selfoss supports all modern browsers, including Mozilla Firefox, Safari, Google Chrome, Opera and Internet Explorer. selfoss also supports mobile browsers on iPad, iPhone, Android and other devices.
</div>

## Installing selfoss {#installation}
<div class="documentation-entry">

selfoss is a lightweight php based application. Just follow the simple installation instructions:

1. Upload all files in the selfoss directory (IMPORTANT: also upload the hidden `.htaccess` files)
2. Make the directories `data/cache`, `data/favicons`, `data/logs`, `data/thumbnails` and `data/sqlite` writeable
3. Insert database access data in `config.ini` (see [database options](@/docs/administration/options.md#db-type) – you do not have to change anything if you would like to use SQLite.)
4. You do not need to create database tables, they will be created automatically.
5. Create cron job for updating feeds and point it to https://yoururl.com/update via `wget` or `curl`. You can also execute the `cliupdate.php` from command line.

For further questions or any problems, use our [support forum](forum). For a more detailed step-by-step example installation, please visit the [wiki](https://github.com/fossar/selfoss/wiki/).
</div>

## Configuring selfoss {#configuration}
<div class="documentation-entry">

All [configuration options](@/docs/administration/options.md) are optional. Any settings in `config.ini` will override the settings in `src/helpers/Configuration.php`. For convenience, the archive includes `config-example.ini` file containing the default configuration exported in INI format. To customize settings follow these instructions:

1. Rename `config-example.ini` to `config.ini`.
2. Edit `config.ini` and delete any lines you do not wish to override.

Sample `config.ini` file which provides password protection:

```ini
username=secretagent
password=$2y$10$xLurmBB0HJ60.sar1Z38r.ajtkruUIay7rwFRCvcaDl.1EU4epUH6
```

Sample `config.ini` file with a MySQL database connection:

```ini
db_type=mysql
db_host=localhost
db_database=selfoss
db_username=secretagent
db_password=life0fD4ng3r
```
</div>

## Importing feeds from a different RSS reader {#importing}
<div class="documentation-entry">

selfoss supports importing OPML files. Find the OPML export in the old application, it is usually located somewhere in settings.
Then visit the page `https://your-selfoss-url.com/opml` and upload it there.
</div>
