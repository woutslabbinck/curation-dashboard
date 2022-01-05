# Curation dashboard

## TODO

### Documentation

- [ ] add proper instructions for starting up etc (the solid css of shapes) -> development

### Features

- [ ] Low: Clean up inrupt stuff
- [ ] Low: add lint
- [ ] Medium: go to drawing board on what is need for dashboard of curation
  - [ ] How to configure
  - [ ] Default configuration
  - [x] View announcements in a list
- [x] Medium: Add configuration after login, when done automatically start init. IDEA: dropdown menu and when click on hidden automaticaly initialise
- [x] Medium: Make it possible to configure again
- [ ] Medium: Show curated LDES

### Development features

- [ ] Development: Add buttons for creating view announcement, dcat-dataset announcement and dcat-dataservice announcement (in different component that can be removed)
- [ ] Development: create an inbox on a certain location

### Bugs

- [ ] Synchronizing acts strange when doing it twice (DC-issued not properly being added) maybe due to caching?
  - [ ] It is due to caching of the announcements. Try doing non cacheable request or something? The contents of the LDP:container is in fact updated when a new resource is added. Another possibility is that the tag on which it knows when cached or not is not correctly updated


