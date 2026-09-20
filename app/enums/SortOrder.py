from enum import Enum

class SortOrder(str, Enum):
    NEWEST = "newest"
    OLDEST = "oldest"