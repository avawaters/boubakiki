library(tidyverse)
library(readr)

data <- data.frame(id=character(),
                   sound=character(),
                   response=character(),
                   voiced=numeric(),
                   rounded=numeric(),
                   low=numeric())
# get files
files <- list.files("../data/")

for (file in files) {
  # read csv
  f <- read_csv(paste0("../data/", file), show_col_types=FALSE)
  
  id <- unlist(strsplit(file, ".csv"))[1]
  
  f <- f %>% filter(!is.na(sound)) %>% select(response, sound, voiced, round, low)
  
  data <- rbind(data, data.frame(id=id, sound=f$sound, response=f$response, voiced=f$voiced,
                                 round=f$round, low=f$low))
}