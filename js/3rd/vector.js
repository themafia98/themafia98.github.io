function Vector(x, y) {

    let _that = this;

    /* current coords */
    this.x = x || 0;
    this.y = y || 0;

}

Vector.prototype.multiply = function (vector) {

    return new Vector(this.x * vector, this.y * vector);
}

Vector.prototype.add = function (vector) {

    /* прибавляю найденные координаты к координатам объекта*/
    return new Vector(this.x + vector.x, this.y + vector.y);
}

Vector.prototype.divide = function (vector) {
    return new Vector(this.x / vector, this.y / vector);
}

Vector.prototype.normalize = function (vector) {

    /*
     * нормализую вектор.
     * Преобразование заданного вектора в вектор
     * в том же направлении, но с единичной длиной.
     */

    return this.divide(this.length())
}

Vector.prototype.length = function (vector) {

    /*  длина вектора  */
    return Math.sqrt(this.dot(this));
}

Vector.prototype.dot = function (vector) {

    /* Скалярное произведение векторов в 2D пространстве */
    return this.x * vector.x + this.y * vector.y;
}