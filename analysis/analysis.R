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

# to test if participants are choosing one sound more often than chance, we are using a one sample t-test

# bouba = vaughvaugh
cond1 <- data %>% filter(sound=="vaughvaugh")
t.test(cond1$response, mu=0.5, alternative="less")
# kiki = feughfeugh
cond2 <- data %>% filter(sound=="feughfeugh")