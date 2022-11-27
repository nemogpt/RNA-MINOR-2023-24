from math import sqrt,radians,sin,cos,asin
def computeDistance(latlng1: tuple, latlng2: tuple) -> float:
    # x1 - latlng1[0], x2 - latlng2[0], y1 - latlng1[1], y2 - latlng2[1]
    # d = sqrt((x2 - x1)**2 + (y2 - y1)**2)
    earth_radius = 6371

    lat1,long1 = latlng1
    lat2,long2 = latlng2

    dLat = radians(lat2 - lat1)
    dLon = radians(long2 - long1)

    a = sin(dLat/2)**2 + cos(radians(lat1))*cos(radians(lat2)) * (sin(dLon/2)**2)
    c = 2*asin(sqrt(a))
    d = earth_radius * c
    return d

# limitRad is in km
def isWithinLimit(userLoc: tuple, atmLoc: tuple, limitRad: int = 0.005) -> bool:
    d = computeDistance(userLoc, atmLoc)
    if d <= limitRad:
        return True
    return False