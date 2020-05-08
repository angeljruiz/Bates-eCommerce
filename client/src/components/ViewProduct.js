import React from 'react';
import { connect } from 'react-redux';

const ViewProduct = ({product}) => {
    return <div className='card'>
        <div className='card-header'>
            <img src={product.image} />
            <h1>{product.name}</h1>
        </div>
        <div className='card-body'>
            <h3 className='text-muted'>${product.price}</h3>
            <p>{product.description}</p>
            <button className='btn btn-outline-primary form-control'>Add to cart</button>
        </div>
    </div>
}

const mapStateToProps = ({products}) => {
    return { product: products.find( t => {
        return t.sku === '2';
    }) || {}};
} 

export default connect(mapStateToProps)(ViewProduct);


// .col-md-10.col-lg-4.ml-auto
// each pic in pics
//   .slides
//     img.slide-img.rounded(src='/uploads/' + pic.name)

// a.prev(onclick='move(-1)') &#10094;
// a.next.mr-3(onclick='move(1)') &#10095;
// .row.my-1
//   each pic, index in pics
//     .column.mr-3
//       img.demo.thumb-img.rounded(src='/uploads/' + pic.name style='width:100%' onclick='currentSlide(' + parseInt(index+1) + ')')
// .col-md-10.col-lg-5.mr-auto.mt-2.ml-2.text-center
// .card
//   .card-header.mt-3: h2= name
//     h4.text-muted $#{price}
//   .card-body
//     .row
//       if quantity > 0
//         //- .qty-input.mr-3.rounded.mb-3
//         //-   i.less.rounded -
//         //-   input(type="number" value="1" readonly)
//         //-   i.more.rounded +
//         p.w-100.lead= description
//         a.btn.btn-outline-primary.form-control.mx-5#atc(href='/addtocart?sku=' + sku + '&amount=1') Add to cart    
        