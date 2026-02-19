# HCI ETHZ Website

This website has been developed using the [Pug template engine](https://pugjs.org/). It features a streamlined content management pipeline, enabling HCI@ETHZ members to collectively update their profiles using the GitHub web-based editor.

## How to Update Website Content

To modify the website's content, edit the `data/groups.json` and `pubs.bib` files directly. Alternatively, create an issue and tag April (@littleaprilfool) for assistance.

### Updating Group Information
Edit `data/groups.json` to update group information. Follow the existing schema:
- `name`: Name of the research group.
- `link`: URL of the group's page.
- `linkAbbr`: Display name for the URL on the website.
- `faculty`: Name of the faculty member leading the group.
- `department`: Name of the associated department.

### Updating Course Information
Edit `data/teaching.json` to update group information. Follow the existing schema:
- `name`: Name of the course.
- `lecturers`: Name of the lecturers.
- `term`: Term that the course is offered.
- `url`: Link to the course website.

### Updating Publications
Edit `pubs.bib` to update the publication list. Ensure to:
- Use the BibTeX format from Google Scholar, not ACM DL, to avoid parser errors (see issue [here](https://github.com/yepengding/bibtex-js-parser/issues/2)).
- Include a comma at the end of each entry.
- Use the `url` keyword to link to the paper.



## Automatic Build and Deployment
Commits to the `main` branch trigger an automatic build process. Check the `Actions` tab to monitor the progress. Once completed, updates will be live at `hci.ethz.ch`.
