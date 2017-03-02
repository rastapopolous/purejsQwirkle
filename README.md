# purejsQwirkle
the classic board game reworked with a purejs, functional oop approach



##Install

##Running
##game logic
* "Blind sensing" is used to determine if a set of tiles just played is horizontal or vertical
* Game logic feels its way along the length of the set, checking each tile to determine if it intersects other rows 
* At intersections logic analyzes whether intersecting tiles were played or existing then iteratively crawls each tile in intersecting array 


##gameplay
* The object of Qwirkle is to score points by creating runs of tiles with the same color or same number
* First player needs a run of at least three tiles to start
* All following moves must intersect the existing game horizontally or vertically
* Your current tiles played are shown with green border on the board
* In place of a move you can trade in tiles by dragging them to the tile bag.  They'll be replaced when your move is finished
* Click "NextPlayer" when your move is finished to verify it.  Your run of tiles just played will have a green border.  
* Intersecting valid runs will show in red
* Click "again to finish your move, refill your tiles and rotatePlay to the next player
* Game ends when tile bag is empty and no one can put out tiles, or all tiles have been played


